import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Sidebar } from '../../components/sidebar/sidebar';
import { MediaFinder } from '../../components/media-finder/media-finder';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Header, Sidebar, MediaFinder],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
