import './main.css';
import 'flowbite';
import { initForm } from './components/form.js';
import { initNavbar } from './components/nav.js';
import { initScrollReveal } from './components/reveal.js';
import { initSwiper } from './components/swiper.js';

console.log('App start');
initForm();

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initSwiper();
});