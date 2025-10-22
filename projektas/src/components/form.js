export function initForm() {
    console.log('Form initialized');

    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]').value;
        alert(`Ačiū, ${name}! Jūsų žinutė gauta.`);
        form.reset();
    });
}  