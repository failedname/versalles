from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def PanelView(request):
    template_name = 'dashboard/panel.html'
    return render(request, template_name)
