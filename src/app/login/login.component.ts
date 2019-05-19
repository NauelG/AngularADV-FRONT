import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;
  auth2: any;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem( 'email' ) || '';
    if ( this.email !== '' ) {
      this.recuerdame = true;
    }
  }

  googleInit() {

    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '167364643408-3d1vnrrlapk4s9uttk8vq6f6nprvku9o.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSingin(document.getElementById('btnGoogle'));

    });
  }

  attachSingin( element ) {

    this.auth2.attachClickHandler( element, {}, googleUser => {
      let token = googleUser.getAuthResponse().id_token;
      this._usuarioService.loginGoogle( token ).subscribe(
        () => {
          window.location.href = '#/dashboard';
        }, err => {
          console.log(err);
        }
      );
    });
  }

  ingresar( forma: NgForm ) {

    if ( forma.invalid ) {
      return;
    }

    let usuario = new Usuario(
      null,
      forma.value.email,
      forma.value.password
    );
    console.log(usuario);

    this._usuarioService.login( usuario, forma.value.recuerdame ).subscribe(
      ok => { this.router.navigate(['/dashboard']); }
    );
  }


}
