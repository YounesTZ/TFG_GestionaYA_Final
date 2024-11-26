import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { TabsComponent } from './core/components/tabs/tabs.component';
import { HeaderComponent } from "./core/components/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, TabsComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GestionaYA';
  mostrarHeaderAndTabs: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // Rutas que NO deben mostrar el header ni las tabs
      const noHeaderTabsRoutes = ['/inicio', '/login', '/registro'];
      this.mostrarHeaderAndTabs = !noHeaderTabsRoutes.includes(this.router.url);
    });
  }
}