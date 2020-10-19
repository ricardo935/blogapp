import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  users:any;
  level:string;
  nuevoUser = {user:'', pass:'', tipo:'', nombre:''};
  tmpUser = {user:'', pass:'', tipo:'', nombre:''};

  constructor(private datos:DatosService, private router:Router, private msg:ToastrService) { }

  ngOnInit(): void {
    this.level = this.datos.getCuenta().level;
    this.llenarUsuarios();
  }

  llenarUsuarios(){
    this.datos.getUsuarios().subscribe(resp => {
      this.users = resp;
      //console.log(resp);
    }, error => {
      console.log(error);
      if(error.status==408) this.router.navigate(['']);
    })
  }

  temporalTema(user){
    this.tmpUser = JSON.parse(JSON.stringify(user));
  }

  agregarUser(){
    if(this.nuevoUser.user == '' && this.nuevoUser.pass == '' && this.nuevoUser.tipo == '' && this.nuevoUser.nombre == ''){
      this.msg.error("Asegurate de llenar todos los campos");
      return;
    }
    this.datos.postUsuarios(this.nuevoUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let user = JSON.parse(JSON.stringify(this.nuevoUser))
        this.users.push(user);
        this.nuevoUser.user = '';
        this.nuevoUser.nombre = '';
        this.nuevoUser.pass = '';
        this.msg.success("El usuario se guardo correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }

  guardarCambios(){
    this.datos.putUsuarios(this.tmpUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.users.indexOf( this.users.find( user => user.user == this.tmpUser.user ));
        this.users[i].nombre = this.tmpUser.nombre;
        this.msg.success("El usuario se guardo correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }

  confirmarEliminar(){
    this.datos.deleteUsuarios(this.tmpUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.users.indexOf( this.users.find( u => u.user == this.tmpUser.user ));
        this.users.splice(i,1);
        this.msg.success("El usuaio se elimino correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }

}
