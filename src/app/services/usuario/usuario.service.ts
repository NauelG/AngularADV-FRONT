import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    public http: HttpClient
  ) {
    console.log('Servicio de usuario cargado')
  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem( 'email', usuario.email );
    } else {
      localStorage.removeItem( 'email' );
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario ).pipe(map( (res: any) => {
        localStorage.setItem('id', res.id);
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.token));
        return true;
      }
    ));

  }

  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario ).pipe(map(
      (response: any) => {
        swal('Usuario creado', usuario.email, 'success');
        return response.usuario;
      }
    ));
  }

}
