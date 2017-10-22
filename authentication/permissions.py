from rest_framework import permissions

class IsAccountOwner(permissions.BasePermission):
    def has_object_permissions(self,request,view,account):
        if request.user:
            return account == request.user
        return False
    
