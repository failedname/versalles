document.addEventListener('DOMContentLoaded', () => {
  $.ajaxSetup({
    beforeSend(xhr, settings) {
      if (settings.type === 'POST') {
        xhr.setRequestHeader('X-CSRFToken', $('[name="csrfmiddlewaretoken"]').val());
      }
    }
  });
  document.getElementById('search-cliente').addEventListener('keyup', buscarCliente)
  document.getElementById('pro_search').onkeyup = buscarProductos;
  document.getElementById('btnAgregar').onclick = agregar;
  document.getElementById('id_saveReal').addEventListener('click', saveRemision)
});

function buscarCliente() {
  const valInput = document.getElementById('cliente_search').value;
  const classResult = document.getElementById('result');
  let html = '';
  $.ajax({
    url: 'cliente/',
    type: 'POST',
    data: {
      data: valInput
    }
  }).done((data) => {
    if (!data.error) {
      for (let i = 0, len = data.data.length; i < len; i += 1) {
        html += `<a data-id="${data.data[i].id}"
                   data-nombre="${data.data[i].nombre}" data-cc="${data.data[i].cc}" class="result" >
                  <div class="content">
                    <div class="title">${data.data[i].nombre}</div>
                    <div class="description">${data.data[i].cc}</div>
                  </div>
                </a>`;
      }
      classResult.className = 'results transition visible';
      classResult.innerHTML = html;
    } else {
      classResult.className = 'results transition hidden';
    }

    for (let j = 0, lon = classResult.children.length; j < lon; j += 1) {
      const click = classResult.children[j];
      click.onclick = function() {
        const cc = this.getAttribute('data-cc');
        const nombre = this.getAttribute('data-nombre');
        document.getElementById('iden').value = cc;
        document.getElementById('nombre').value = nombre;
        classResult.className = 'results transition hidden';
      };
    }
  });
}

function buscarProductos() {
  const valuePro = document.getElementById('pro_search').value;
  const selectPre = document.getElementById('selectprecios').value;
  $.ajax({
    url: 'producto/',
    type: 'POST',
    data: {
      data: valuePro,
      precio: selectPre
    }
  }).done((data) => {
    const idClass = document.getElementById('resultPro');
    let html = '';
    const objeto = data.data;

    if (!data.sin) {
      for (let i = 0, len = objeto.length; i < len; i++) {
        if (i < 9) {
          html += `<a data-id="${objeto[i].id}" data-iva="${objeto[i].iva}"
                     data-nombre="${objeto[i].nombre}" data-precio="${objeto[i].precio}" class="result" >
                    <div class="content">
                      <div class="title">${objeto[i].nombre}</div>
                      <div class="description">${objeto[i].presentacion}</div>
                      <div class="price">${objeto[i].precio}</div>
                    </div>
                  </a>`;
        }
      }
      idClass.className = 'results transition visible';
      idClass.innerHTML = html;
    } else {
      idClass.className = 'results transition hidden';
    }
    for (let j = 0; j < idClass.children.length; j++) {
      const enlace = idClass.children[j];
      enlace.addEventListener('click', function() {
        const codigo = this.getAttribute('data-id');
        const nombre = this.getAttribute('data-nombre');
        const iva = this.getAttribute('data-iva');
        const precio = this.getAttribute('data-precio');
        document.getElementById('id_codigo').value = codigo;
        document.getElementById('id_producto').value = nombre;
        document.getElementById('id_iva').value = iva;
        document.getElementById('id_precio').value = precio;
        document.getElementById('id_cantidad').focus();
        idClass.className = 'results transition hidden';
      });
    }
  });
}

function agregar(e) {
  e.preventDefault();
  const cod = document.getElementById('id_codigo').value;
  const producto = document.getElementById('id_producto').value;
  const iva = document.getElementById('id_iva').value;
  const precio = document.getElementById('id_precio').value;
  const cantidad = document.getElementById('id_cantidad').value;

  addRow(cod, producto, iva, precio, cantidad);
  document.getElementById('id_codigo').value = '';
  document.getElementById('id_producto').value = '';
  document.getElementById('id_iva').value = '';
  document.getElementById('id_precio').value = '';
  document.getElementById('id_cantidad').value = '';
  document.getElementById('pro_search').value = '';
}

const addRow = function(codigo, producto, iva, precio, cantidad) {
  const tbody = document.getElementById('bodyTable');

  const tr = document.createElement('tr');
  const realIva = (parseInt(iva) + 100) / 100;
  const TotPro = cantidad * precio;
  const resIva = TotPro - (TotPro / realIva);
  tr.innerHTML = `<td>${codigo}</td><td>${producto}</td>
                <td>${precio}</td><td>${resIva}</td>
                <td>${cantidad}</td>
                <td><button class="ui icon button">
                  <i class="remove icon"></i>
                  </button></td>`;
  tbody.appendChild(tr);
  calcular(tbody);
  for (let i = 0; i < tbody.children.length; i++) {
    const button = tbody.children[i].querySelector('button');
    button.addEventListener('click', function() {
      const padreButton = this.parentElement;
      const child = padreButton.parentElement;
      tbody.removeChild(child);
      calcular(tbody);
    });
  }
};

function calcular(tagbody) {
  let sub = 0;
  let iv = 0;
  let tot = 0;
  const subTotal = document.getElementById('id_sub');
  const subIva = document.getElementById('id_iv');
  const resTot = document.getElementById('id_tot');
  for (let i = 0; i < tagbody.children.length; i++) {
    const precio = parseInt(tagbody.children[i].cells[2].innerHTML);
    const iva = parseInt(tagbody.children[i].cells[3].innerHTML);
    const cantidad = parseInt(tagbody.children[i].cells[4].innerHTML);
    const total = (precio * cantidad) - iva;
    sub += total;
    iv += iva;
    tot = sub + iv;
  }

  subTotal.value = sub;
  subIva.value = iv;
  resTot.value = tot;
}

function saveRemision() {
  const allSAve = {};

  const tbody = document.getElementById('bodyTable');
  const ident = document.getElementById('iden').value;

  allSAve.cliente = {
    id: ident
  };
  allSAve.res = [];
  for (let i = 0; i < tbody.children.length; i++) {
    const codPro = parseInt(tbody.children[i].cells[0].innerHTML);
    const canPro = parseInt(tbody.children[i].cells[4].innerHTML);
    const valPro = parseInt(tbody.children[i].cells[2].innerHTML);
    const ivaPro = parseInt(tbody.children[i].cells[3].innerHTML);
    const valNeto = (canPro * valPro);
    allSAve.res.push({codigo: codPro, cantidad: canPro, valorU: valPro, iva: ivaPro, valorN: valNeto});
  }
  const data = JSON.stringify(allSAve);
  $.ajax({url: 'guardar/', data, type: 'POST'}).done((res) => {
    removeAll();
    document.getElementById('messageSucces').classList.remove('hidden');
    document.getElementById('messageSucces').classList.add('visible');
    FacturaPdf(res.data, res.nume);
  }).fail(() => {});
}

function removeAll() {
  document.getElementById('cliente_search').value = '';
  document.getElementById('iden').value = '';
  document.getElementById('nombre').value = '';
  const tbody = document.getElementById('bodyTable');
  tbody.innerHTML = '';

  calcular(tbody);
}

function FacturaPdf(dat) {
  const imagen = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gBcYm9yZGVyIGJzOjAgYmM6IzAwMDAwMCBwczowIHBjOiNlZWVlZWUgZXM6MCBlYzojMDAwMDAwIGNrOjUwMGQwMmE0ZjFmMWQ3NDk3MzQwY2M1ODY4OTZiZjEx/+IL+ElDQ19QUk9GSUxFAAEBAAAL6AAAAAACAAAAbW50clJHQiBYWVogB9kAAwAbABUAJAAfYWNzcAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAPbWAAEAAAAA0y0AAAAAKfg93q/yVa54QvrkyoM5DQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQZGVzYwAAAUQAAAB5YlhZWgAAAcAAAAAUYlRSQwAAAdQAAAgMZG1kZAAACeAAAACIZ1hZWgAACmgAAAAUZ1RSQwAAAdQAAAgMbHVtaQAACnwAAAAUbWVhcwAACpAAAAAkYmtwdAAACrQAAAAUclhZWgAACsgAAAAUclRSQwAAAdQAAAgMdGVjaAAACtwAAAAMdnVlZAAACugAAACHd3RwdAAAC3AAAAAUY3BydAAAC4QAAAA3Y2hhZAAAC7wAAAAsZGVzYwAAAAAAAAAfc1JHQiBJRUM2MTk2Ni0yLTEgYmxhY2sgc2NhbGVkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAAAkoAAAD4QAALbPY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t//9kZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi0xIERlZmF1bHQgUkdCIENvbG91ciBTcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAAAAAUAAAAAAAAG1lYXMAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAAADFgAAAzMAAAKkWFlaIAAAAAAAAG+iAAA49QAAA5BzaWcgAAAAAENSVCBkZXNjAAAAAAAAAC1SZWZlcmVuY2UgVmlld2luZyBDb25kaXRpb24gaW4gSUVDIDYxOTY2LTItMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y10ZXh0AAAAAENvcHlyaWdodCBJbnRlcm5hdGlvbmFsIENvbG9yIENvbnNvcnRpdW0sIDIwMDkAAHNmMzIAAAAAAAEMRAAABd////MmAAAHlAAA/Y////uh///9ogAAA9sAAMB1/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/8AAEQgAYADIAwEiAAIRAQMRAf/EAB0AAAICAwEBAQAAAAAAAAAAAAAHBQYCBAgDAQn/xABDEAABAwMDAgQDBQQIAwkAAAABAgMEBQYRABIhBzETIkFRFGFxCCMyUoEVFmKRJCUzQoKhscFyg5JDRFNzk6KjsuH/xAAbAQEAAgMBAQAAAAAAAAAAAAAABAUBAgMGB//EAC0RAAICAQMBBQgDAQAAAAAAAAABAgMRBBIhMQUGQVFxExQiMmGRodGBweGx/9oADAMBAAIRAxEAPwDqnRo0aANGjRoA0aNGgKv1BvekWLQ3KnWn/DaSQlKQMqWo5wlI9VHB49gSSACdI6T9pacXFri2ZPXFwSla5CULPt5Niv8AU6jvtVOvOX5abErPwP8ASFoB7KdASB9SPJ/P56XedV+s1r08lGKyew7t92a+16Z3WWOOHhJemcv7k7Uup3UiryDKTWIlIQeURWYqHdvtuU4FHP64+Q7aZ/Q7rFPrVZXbV3NtIq6Gy4y81wiSgdyB6KAycDggHgEcpPUQ5Xk2zftuVhLK33Iay4pltW1TiDxszjjOVD1764aPW2W27Z9GWveTuxouz9B7xRlSi11ec54+/jwfoKORxo1yS51X6oVBYfiQ6PTIw5bjvlxS9voFHd3/AET9NMPpJ1jmVutm3bugogVvwy634aipqSgckoJJIIAJxk8A8jGNWyknwj5lXq6LZOFc02vBMeejQORkaNZJAaNGjQBo0aNAGjRo0AaNGjQBo0aNAGjRo0AaNGjQBo0aNABIAJJwBpIdTOsE2DcarXsmnoqNbQgLfceUUsRUnBBWQQScEHAIxkck8adM1Klw30o/EUKA/lrj2juCh9Yb5pVWUG5lRmfFxVrOPFbKlrSkH1O1xPA/KR6a432Srrc4rLRxvslXW5RWWj7ftKvu9oEdqt1ahOOx3viGfCZWgtqxggObd2Dx39h7apzxn0lbca5IioT6jtQ/wWHj/CscA/I6dWvKVGZmxnIstlt+O6Nq2nE7kqH01RWal3cWrP8A027E72a3se7fXhxfVPo/9+on5L7UWOt+QsIaQNylHXyyaZ8Y+u4p7f3zxxEbV/2TY43fU/8A766gZVlz63XK1EtQuOUWC+UI+IewjeO6Ek8Eg5wfbGTyM3Wj1LwBHpVXiKpVSaQG0x3eEOADALauyh8gf599TtNRCnOHlv8AC9CZ38726jtnSwp08dsFzJZy+nj9P9z1JvUY1NYp/U+xpUp34VhuU4hySsEIG9ISElXpnkfLOTxqTIIOCMarvUIsC0ZqZOMr2hkepc3DGPn3/TOpcHiSPl/ZNvstZXLGecffj+ztynrC4TBBzhAB+o4OtjVa6dJmotKnJqu749MdkSN3fxfCTv8A/dnVl1KPpAaNGjQBo0aNAGjRo0AaNGjQBo0aNAGjRo0AaNGjQBo1g86hlpTjq0obSMlSjgAaWdY632hCecZgOzay42dqv2bGW8gH/wAwDYf56GspRisyeEM/XLH2gEswOtVmTqihpunlDrKXFJAAcClEZPsC42flnOmTF6924teJlKuGE36uPU9akj/o3axuCb066xUs0tNXhyXXDlDJc8GShYGAtCVDclQzjlOD2I1rJKcXHzNN0LotRefQqRSQcYOdU29rn+GfZt6hvIXcE9YYBSciKlXdasdlAcgenf2zB3xa8Gy54ojHUG458vO1FEpzBcdQMcJUsOhKePTaTjB241D0WJRqVc1gV6lwpkGl1RiSypc18PLckpW42VbgEjHnbHCRj/M1a0Hs8zk848CtjoPZ5nJ5x4DYotMi0WlRqdATtjx0bU+6j6qPzJyT9dFYpcGtQFwqpGRJjq/uqHKT7pPcH5jW6QQceusEOtuF0IdbUWjtcAWDsPsfb9dVe6Wd3iVm6Wd3iKy3rRq/7/qtRN2SIDT0dUmnuvRxJDyU8lvBUNqgAo8ceU9sjTxsXoVFplYj1e4KhKrlRjnew7KSENMn0UhoE+YemTjPOMgHS7t95Fy9cKAmjqEiPQ2H3pkho7kpK0FIRkcE5KRx7n2Ouib6vyg9P6GiXcM1Lagja2wjzOvKA7JT6+nPYZGSBzr0mnblXGUlyX2lqhtVrglJ+OFktLLbcZhKE+VCR3J/zOlne/XKzbWkqhiY5VakDt+EpyfFUFexP4Qc+hOflpRXFcV59UVKE1562LVXwmGycSpKP4z/AHQRnjtz2V31rUhij2/LNHtGjrqFZ24WxDAW4n5vPK4bTn8xHfga5WauKlsrW5mbNXFS2Vrc/oWuT1wvmpZNAsAx2s+VdQlBClD32qCcfzOtdrqx1YbVufs+kPN+qWpSEn/7n/TU5RemF0VxIeuKsCkx1/8AdKSBvA9Nz6wTn/hSB7HVoa6IWcUgzIkia9jl2TNkOKPzyXP9ANbR94fMsL7v+zaPvD5lhfd/2U2J9op6nKxedlVelN5x47H3zf1KiEj+WdNOzOpNp3k2DQazGfexksKOx0e5KFYVj54xqpVDoxHjhSrYrtVpR24SyXzJY/Vt7d/kpOldd/ROtBxUhdGpk91BBRLpLpp0nPfcUK3NE/4gddFKxfMs+n6f7OilYvmWfT9P9nVoORkcjRrjmFffUbpytKJEyXNp4VtEe4Yyml/PbIBKFccAlw/JPppp2Z9pG16stuNcbL9BmK4y952VH5OD0+ZCRrommdFJMeejWpTKnBqsRuVTZbEuO4NyHWXAtKh7gjuNbesmQ0aNGgDRo0aANGjWDytjLih3SknQHPPW65nrguR+22HFpotO2/GJSrAlPKAUG1e6EpKVEepUAexytZlUjQ3Uw23ojK0gBSnlFDLA9MhIKicdkISpRHoBzreddcly6vJQra9JqExxKlDOPvlhGR64SEj6DWn06s+p1RaxQ46J8rcUyatIyiOhX95KFcqWc8kJ9fxFPAHB/FI8bdntDWWb05qDworheWW+iXHPi+hvx5NtoSPjahes9381NpTcZj/CHQV/qVfpqBvBFEuBTFGtSHcT9cdIUtdabYDcVr1WryE89hgj9TgHfuuGy7MXQ6JXXpktt1LU+sFYiwoiieGmUpO5x09sFah6Yzkpt9u0GFb0ExoCVFSyFPPunc48r3Uf9uw1H1OpVCwkslmktN81cE/DC6erKzNpMKw7BrD8TLtQcYUhyaofeuuuHaDnuACoHHy5ycnTlV0ip9c6QUa2am2UuQ46NrjWAtp8DzrRnjlRXkHgg++DpaVuN+2rxsy3wN6JNQ+NkJ9C1HTvKT8ldvqNdVx2/CYbb/KkDW2gTdbsl1bLHQput2S6tnLzfSHqQ0sU9F6N/sweQPGGoydv/TnP/M/XVjg/ZotcRGVVFU6VKGVPPvSygvKJySQAQP559yTzp81CbGp0J6XPfajxmUlbjrqglKUjkkk9hrm69+qFb6iSpFG6fuuU23UEtyq2pJSt33SyOD+vB7fh7mS/Z0py4RJfs6U5cJHvWLqt7pstVpdLqTHqFxqJLiGcqZjqHG95wnKiM9ieP4eM1aJQkRJb10XzVE1OtABTkyScMxueEtpPAwTxx9APX1p8al2eyxRaBAenVeVgtxGcKkSD+dxXZKBzlRwkDOPXTMsnpRImSWa3fDrEyc2fEiwUgmJDOOCEn+0X/Gr9BwDqE5WaviPww/LIblZq+I/DD8spFKgz7vkREyJ4tigS1bWXZDiWp1RHb7lCuW0H82Co8YHOn/Z9oUW1KW3DosJiOwnzeQfiP5iTypX8RJPz0jvtHWlBpVu29NQ0h6vyq9HQuoLAU+vKXDt34zt4GEjCRgYAxpwXbX1QKSzS6UwmdXZjeI8YqIQgf+I6R+FscZPc9hkkAzaqYVLbBEyqmFMdsEWX9rQVNvrakNu+Avw3A2dxC/y/XXnT61EnTHYrCj47QBcQSCUZ5AIB44550jaMhnp1Bt+y6NTpFRl1aYoSZrj/AMOtStoL8hIwSQlOPbskAqIJ1PWldca3L/plmRLZTTqfUIzkmLK8XK3SkndvRjIJCSolRKjxu5Jx0Oo5tGqJUb++Eu+XTfg0/sinxw7OqSnRtbdUoBDCUjlThB3be+CjvuGo6V1CrTd4U+mt23/Vr7Dsl6QZG5+O2gcFbKUnG9WAkZyTngbSNAMV+HHkJUHWUKChg8YyPnpdXT0Rsa4dypFEjMPnJ8WMnwFZ9/JgE/8AEDrUp3VWdPuyvUhi3Vufs0NoQlqQlbjrq07ig9kI2g+YlZAOBySBqVpd61sn4Sr0WKzW3QVs02LL8ZTbecBbq9oCQTkcZzjjJBAAVzn2fK5a0pczpzeE+nOZ3eA/50LPpvKcAj5FCtTdNvnqjaSwxelpivREYBnUVQU6R6nwThSj+iBq3WF1Bq1evq4LZrNEjwZFJDRW9GlF9tXiIK0jJQkg4Ht79scslaErTtWkKT7EZ0BSLQ6p2pdD/wALCqSY9SB2rgzElh9KvbYrBOPcZHz1d0qCgCkgg+o1BXBZ9BuFjwazS4kxA7B9pLm36bgcfpjURCsyTQyP3drM5hkdosl1Uhr/AOQlYHsEqSPloC66NaVLXOU2pNRbQlacAKR2V7nGTjRoDd1g+krZcSO6kkf5az1DXZc1JtOjvVOuzG4sVsd1HlR9EpHck+w50BzDQLbNx3lWqHKdVFotLmSnqrI3+HlovuFtrd3SFIG5R9Eg8gnUxc15SbreZs3pvGcjUMI8NT0UBlcpscHYcYZjjsXCMqPlQFHOY9mLXer1ZnmhU9dEtWbKEiQt1OTJWlKUJKxnDhAQn7sHw0kZWVK8p6AsyzaRZFGWmI394B4j8h5W5x1QH4lr9T/IAcAAa0x4IjU6eFOVWsZbb+rbOcrvtWJSK7adlshtx9n+tqkptG1tptBIbaQnJISV7t2SVKO0qJwMW48nVYtaaq5a/cl4vbiKrLLMQqGMRmvKkj2zjn5p1ZXHW2GnHn1bWmklxavZIGSf5ao9dNSt2x6LgqdbPdbtj0XB6dHoX7a6y1ypKG5ijQ2ae2fQrWS6sj5jbtP10674vGi2TRHapX5aI7CeEJ7rdV6JSnuScf6nsDrnrp1f8Dp305TPksrn3Zcsl6oMUtjl1XiL2oKsZ2oIQkg45ycA86gpzEmdO/e/qnPaempP9Gg92IueQhCBnevjsM9s+Y8i1c46auMX18vMtXOOmrUX18vM3q9U7g6uTEyrhD1JtBCt8alIVtclAchbp9Ae/wDp+Y79CYqN0OCkWBHaYp7H3LlWLWY0f3Syns6sd/yjjJ51uMWlXropjtTrlPkxqNwI9E8XwX5qlEBJlOD+yb5yUJyrGc8gAwvWKLenS6LbtwRroeVG+IDBpcZkRYbQAKktoaSSNuEqHmyrsc51pHTyue+/+Ec40Sulvv8A4Q/+n3TykWdFcMdtcifIwqTMkK8R59Xutfr8gMJHoPXV114QXhIhsupVuC0g59/npJ9QKvddV64W/blt1IIpUJLc+pIZR+BO8jY4r3UkYCRg5Vu5ABE0ndCV6529W7qrVnwaE3H2QqgipPvSMltHh/hBSCFKzuVwMdjkp76vtt28zRGHZDqnJVQd+8fkOYK3FAeuOPoBgDsANTE2bFp8Yvz5LLDaR5nHFBIH6nX2NOiyYiZUeQ05GUNyXUqBSR750AnrOpdw1fqJXblqdNEVxTvwUFT60rS1DQc+RKScKcXlSt3bAA3Z497ptWtVvrVAqtN8KLTqdTVR/iDgrDjhUFbE9gQnHmVx5uysEaa8KpwZ0UyYcth+OCR4jawU5Bwefrryp9aplS8UwJ8WSGjhwtOBW0/PHbQCT6lW3VY122pDgUeoTrVhqclSEU+aI765RB2OKWpxCiQo53bgSSok5xm2hms0O2qlOp9FZMx1oiJB3hTjjxGAp11ZAUe2TngA4UrV5YuSiPzTDZqsJyUDgtJeSVA/TOpVSglJKiAB6nQFC6U2cLRtFIfHj1mRulTZKhlb8hXK1E+vJIHyA9zqjdKlXZAmXM7VrdfNw1KoOPCe6+0qOlralLafKouEJAVgbcc8kZOHOqtUxMn4cz4ofzjw/EG7+WoDqxeLVjWHU64sJW80jbHbJ/tHVcIH0yQTj0zoCt0tcSxDLg02NIuC7Jq1TZiWlISorWfxuLUQltPG1Kc9kkJCiFawg3xdkWeV3XR4FMZcVsh0+JI+Lly14yQnASkJA7qOAO5wOdbvSylm0uny6zczxNVkNrqVUlPfi8Qp3Kz7BAARgcAI41B9Cvi7xlVTqDXEHxqk4pinNL5+HhoVhKR7FSgSr3KUnQExBuPqFVK+wyLZgUqlHzLekTA+6U+wQjgK/wARSOeTwCy293hp8TG/A3Y7Z1q1KqQKWz4tRmR4rWcbnnAkf562G32nGEvIcQppQyFg8EfXQHpo1Es3JRHpphs1WEuUDgspeSVg/TOjQEDdN4zIm6JbNEl1apK4SV/cR2/4lOLwCPkkKV8tUimdI59z1tqv9UamKvNb5Zp7SSiFGz6JQeV9hyrGfUKwNOlLaEElCEpJ7kDGdZaA14MKPAjoZitJbbQkJASMYA7D5D5aWn2kbhfovTWTEgbjUaw4imRwPVTuQfp5QvB9wNNPS1642hULootLfowbcqFKntT2mXVbUvbM5QVYO3IUeccEDsMkYeccGHnHAr6RTmqRSYdOj8tRWktA4/Fgcq/U5P669Z8NuoQJUJ8KLMlpbK9hwdqgQcH6HWTdNvOS4luPZzrSzwpcqosBtJ/5ZWo/onVipHSStVcpXeFZ8OKfxU+lBTDavkp0/eLBHcDZqjhob5yzLgo4aK6csy4FVbVFplAqK6baMJ+vXKsBC1KcCvh0dh4rmNrSBjGPxHgc8advT7pUmDNZrt2yE1SvJGW1bSlmJnulhB/D6DefMcemTq/Wxa1HtmA3Do0GPFYRyENICRn3+Z+Zyfnqb1bVURre58y82W1VCre5vMvMxQhKEBCEgJHYAaQX20mwvphTlHuiqNqH/puD/fT/ANKf7RNmVK/bco9DpKm2lKqKXnnnM4baS2sEgDlRyU4H8yByO53JFd1SIluUaj0FpEu5JcNtaG1ZLcZBGPGdxyE57DuojA9SNKpSaR0asadW6q6udVZLm9150gPTpKhwCew7cAcISOBgHNqsCz41qUsNhxyVPcwqRLeOXHlgAZJ9MAABI4SAAOO6/wDtG2fctxu2vUrWbYlO0eX8SqG+oJQ8rKSknJA42kYJGQo6AgqtTYPUS3X23Sm5bgmtlAnJ8QU+nKUMFTKj5VbM8bcrUQN2Eny59UqDC6edGnIkl9x+mxIPwUOEpzal6U4SC64AfORkr2/hGCcE423mjwruuRhpNdjRLfheUux4L6nXnseinsJ2p4/CjJP5k+sd1GtCrXhf1px1IQLWojglvhaiVSHwPINuMYTgZJIyFq76yCC6WdLnJ3Tmk0q50yI9KSzvXTEOraLziyVKU+UEKUQTgIyEgAbgpX4YvrlQ3+ndnUIWfSmf3ZhzEv1aI0CPiUAjCXDyVIOClRUTnKc5Gugag49Cprq4Mb4h5tH3bW7G4+gzpaRK5fNwUyfTK3ZUGKp8ONpcdnpfZ2KyBlKAVHAOCMDPuM8YBnaJ6eOWym/qXT6bCipilbr6Izba20pzuSraM5BBBAznGORjWtaCqh1PiruG4S7Ctl0n4ClhRR4jWceK+R+Iq7hH4AkjO8kEVa++k9WpPQtiz7O/pchyUh2YXVpbL4BKieTtHm2kDPZOMk97BDt28JNjJj1diAyxAg7ItEgqUGpLiW8IS+6rlSMgZQkBOMhSlDI0BQrIty2bz6+SJ1r0qExblttpR4kdoJRJlEqwsAADCfMQR6oSeQRq09Vlfvv1ltSyGAHKdSv64qKRgpynhtBH1IBHs4NbHQ+wbioduss1zw4TnxTk6SI7u9yU6rtvXgAAADypyCRkqwSkx9iWTebt4XjU6uliAK1NBMtDviSBGQVBLbeBhAKSkbiSoBPCQcKAE39paqvotSlWdR14qdySkQkd8paBHiKOPTlIPyUdS143TS+kdh0enRTHRLdDcGntSV7EAgBO9xXohIwVK/3OqxcFp3hUeuTdajRYf7Mp0D4SBIkuFQbUpOFOBpPKleZQwSkEY83GNaPU+w7wjXjZ1ft1Ddd/Y7RbcYmvJQXFKJ3rKjhOVBXpjBSnAxwAPO47QpnUekIiRPiKxU5K0F64pKFobYQFgq+HCuDuAKQlHkGSVKKuVbn2gmazaFh2y3b8YyLcpLzX7RiBR+9YRgJbWfVsgbVe+RnjOrrHhXVVYyZtajR4LTGHm6XT3lEurHbxXiAVDP8AdCQPcqHGtKFXb5rtPnU2t2TBjKf3toW7UEvM7FZA3JQkqOAcEYGeeRngDe6Z02x7ip8K7LZpFPYW+1t3NxW23EHsUq2jIIIIPPp6jGjUp0lsWN0+tFijRnVvKBLjzqxguLPdWBwPYDnAA5JySaA//9k=';
  const doc = new jsPDF('A4');
  doc.setFont('courier');
  doc.setFontType('normal');
  const nit_vivero = dat[0].nit_vivero;
  doc.setFontSize(10);
  doc.text(40, 38, `NIT:  ${nit_vivero}`);

  doc.addImage(imagen, 'jpeg', 15, 4, 70, 30);

  doc.setFontSize(13);
  const cod = dat[0].remision;
  doc.text(155, 20, 'REMISION');
  doc.text(165, 25, 'No.');
  doc.text(165, 35, cod.toString());
  doc.setFillColor(150);
  doc.roundedRect(5, 45, 200, 10, 1, 1, 'F');
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(7, 51, 'Km. 15 Via a San Agustin PITALITO-HUILA  Cels: 320-8021865');
  doc.setTextColor(100);
  doc.setFontSize(10);
  doc.setDrawColor(0);
  doc.rect(5, 60, 150, 34, 'D');
  doc.setTextColor(0);
  doc.text(7, 66, 'Cliente:');
  doc.text(7, 74, 'CC/NIT:');
  doc.text(7, 82, 'Dirección:');
  doc.text(7, 90, 'Telefono:');
  doc.rect(155, 60, 50, 17, 'D');
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(160, 64, 'Fecha de elaboración');
  doc.text(160, 81, 'Fecha de Vencimiento');
  const fecha = dat[0].fecha;
  doc.text(165, 69, fecha.toString());
  doc.text(165, 75, 'Año  Mes  Dia');
  doc.text(165, 91, 'Año  Mes  Dia');
  doc.rect(155, 77, 50, 17, 'D');
  const nombre = dat[0].cliente;
  const nit = dat[0].nit;
  const tel = dat[0].telefono;
  const dire = dat[0].direccion;
  doc.setFontSize(10);
  doc.text(168, 86, 'CONTADO');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(30, 66, nombre.toString().toUpperCase());
  doc.text(30, 74, nit.toString());
  doc.text(30, 90, tel.toString());
  doc.text(30, 82, dire.toString().toUpperCase());

  const columns = [
    'CODIGO',
    'PRODUCTO',
    'VALOR U',
    'CANTIDAD',
    'IVA',
    'TOTAL'
  ];
  const rows = [];
  let tot = 0;
  let iva = 0;
  const desc = 0;
  let bruto = 0;
  for (let i = 0; i < dat.length; i++) {
    rows.push([
      dat[i].codigo,
      dat[i].nombre,
      dat[i].valor,
      dat[i].cantidad,
      dat[i].iva,
      dat[i].valneto
    ]);
    tot += (dat[i].cantidad * dat[i].valor);
    iva += dat[i].iva;
    bruto += dat[i].cantidad * dat[i].valor;
  }

  doc.autoTable(columns, rows, {
    addPageContent(data) {
      doc.rect(data.settings.margin.left, doc.internal.pageSize.height - 60, 120, 30);
      doc.rect(data.settings.margin.left + 120, doc.internal.pageSize.height - 60, 80, 30);
      doc.setTextColor(100);
      doc.text(data.settings.margin.left + 4, doc.internal.pageSize.height - 55, 'Observaciones:');
      doc.text(data.settings.margin.left + 127, doc.internal.pageSize.height - 55, 'Valor Bruto:');
      doc.text(data.settings.margin.left + 127, doc.internal.pageSize.height - 48, 'IVA:');
      doc.text(data.settings.margin.left + 127, doc.internal.pageSize.height - 41, 'Dscto:');
      doc.setTextColor(0);
      doc.text(data.settings.margin.left + 127, doc.internal.pageSize.height - 34, 'VALOR A PAGAR:');
      doc.setFontSize(10);
      const TotFormat = moneda(tot);
      const BrutoFormat = moneda(bruto);
      const IvaFormat = moneda(iva);
      const DescFormat = moneda(desc);
      doc.text(data.settings.margin.left + 167, doc.internal.pageSize.height - 55, BrutoFormat.toString());
      doc.text(data.settings.margin.left + 167, doc.internal.pageSize.height - 48, IvaFormat.toString());
      doc.text(data.settings.margin.left + 167, doc.internal.pageSize.height - 41, DescFormat.toString());
      doc.text(data.settings.margin.left + 167, doc.internal.pageSize.height - 34, TotFormat.toString());
      doc.setFontSize(8);
      doc.text(data.settings.margin.left + 2, doc.internal.pageSize.height - 27, 'Elaborado por:');
      doc.rect(data.settings.margin.left, doc.internal.pageSize.height - 30, 130, 10);
      doc.text(data.settings.margin.left + 132, doc.internal.pageSize.height - 27, 'Recibida por:');
      doc.rect(data.settings.margin.left + 130, doc.internal.pageSize.height - 30, 70, 10);
      doc.setFontSize(7);

      const vivero = dat[0].vivero.toUpperCase();
      const vivero_nit = dat[0].nit_vivero;
      // doc.text(data.settings.margin.left, doc.internal.pageSize.height -15, `NUMERACION HABILITADA SEGUN RESOLUCION DIAN ${numer} DEL ${fecha} DEL ${ini} al ${fin} `)
      doc.text(data.settings.margin.left, doc.internal.pageSize.height - 12, `REMISION POR COMPUTADOR, IMPRESO POR ${vivero} NIT ${vivero_nit}`);
    },
    theme: 'grid',
    startY: 96,
    margin: 5,
    cellPadding: 30,
    headerStyles: {
      fontSize: 6,
      font: 'courier',
      fontStyle: 'bold',
      fillColor: [96, 187, 82]
    },
    styles: {
      fontSize: 6,
      font: 'courier',
      cellPadding: 1,
      cell: 6
    }
  });
  doc.output('dataurlnewwindow');
}

function moneda(number) {
  const dato = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD'
  }).format(number);
  return dato;
}
