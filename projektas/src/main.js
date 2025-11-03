import './main.css';
import 'flowbite';
import { initMenu } from './components/menu.js';
import { initForm } from './components/form.js';
import { initNavbar } from './components/nav.js';
import { initScrollReveal } from './components/reveal.js';

console.log('App start');
initMenu();
initForm();

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
});