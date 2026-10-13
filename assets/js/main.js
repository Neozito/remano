'use strict';
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function setMenu(open) {
  navigation.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) setMenu(false); });
const desktop = window.matchMedia('(min-width: 901px)');
desktop.addEventListener('change', () => setMenu(false));
if ('IntersectionObserver' in window) {
  const sections = document.querySelectorAll('#inicio,#servicos,#sobre,#galeria,#contato');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) {
      navigation.querySelectorAll('a').forEach(link => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }});
  }, { rootMargin: '-15% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}
document.getElementById('year').textContent = new Date().getFullYear();
// The browser opens the prepared conversation. The visitor sends it in WhatsApp.
const form = document.getElementById('contact-form');
const phone = document.getElementById('phone');
phone.addEventListener('input', () => phone.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  const digits = phone.value.replace(/\D/g, '');
  const local = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  if (local.length < 10 || local.length > 11) {
    phone.setCustomValidity('Informe um telefone com DDD, com 10 ou 11 dígitos.');
    phone.reportValidity(); return;
  }
  phone.setCustomValidity('');
  if (!form.reportValidity()) return;
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !message) {
    document.getElementById('form-status').textContent = 'Preencha seu nome e sua mensagem.';
    (!name ? document.getElementById('name') : document.getElementById('message')).focus();
    return;
  }
  const vehicle = document.getElementById('vehicle').value.trim();
  const text = ['Olá, Remano! Vim pelo site e gostaria de atendimento.', '', 'Nome: ' + name, 'WhatsApp: ' + phone.value.trim(), ...(vehicle ? ['Veículo: ' + vehicle] : []), '', 'Mensagem: ' + message].join('\n');
  document.getElementById('form-status').textContent = 'Abrindo sua conversa no WhatsApp...';
  window.location.assign('https://wa.me/5545999053112?text=' + encodeURIComponent(text));
});
// Native modal: keyboard focus stays inside, Escape closes, and focus returns to the thumbnail.
const dialog = document.getElementById('lightbox');
const pictures = [...document.querySelectorAll('.gallery-item')];
let current = 0;
function showPicture(index) {
  current = (index + pictures.length) % pictures.length;
  const link = pictures[current];
  const image = document.getElementById('lightbox-image');
  image.src = link.getAttribute('href'); image.alt = link.dataset.caption;
  document.getElementById('lightbox-caption').textContent = link.dataset.caption;
  document.getElementById('image-counter').textContent = `${current + 1} / ${pictures.length}`;
}
if (typeof dialog.showModal === 'function') {
  pictures.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault(); showPicture(index); dialog.showModal(); document.body.classList.add('modal-open');
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  document.getElementById('previous-image').addEventListener('click', () => showPicture(current - 1));
  document.getElementById('next-image').addEventListener('click', () => showPicture(current + 1));
  dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); showPicture(current - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); showPicture(current + 1); } });
}
