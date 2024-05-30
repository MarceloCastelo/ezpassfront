document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login_forms');
    const emailInput = document.querySelector('#exampleInputEmail1');
    const passwordInput = document.querySelector('#exampleInputPassword1');
    const loginButton = document.querySelector('.btn-primary');

    loginButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: email,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login realizado com sucesso!');
                window.location.href = './home.html'; // Redirect to home page
            } else {
                alert('Erro no login. Verifique suas credenciais e tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro no login. Tente novamente.');
        }
    });
});
