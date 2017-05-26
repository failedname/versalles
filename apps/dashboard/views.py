from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from apps.ventas.models import detalleUser


@login_required
def PanelView(request):
    vivero = detalleUser.objects.get(usuario__pk=request.user.id)
    request.session['vivero'] = vivero.vivero.id
    template_name = 'dashboard/panel.html'
    return render(request, template_name)
