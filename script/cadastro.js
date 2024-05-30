document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.cadastro_forms');
    const emailInput = document.querySelector('#exampleInputEmail1');
    const passwordInput = document.querySelector('#exampleInputPassword1');
    const registerButton = document.querySelector('.btn-primary');

    registerButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: email,
                    password: password,
                    role: 'ADMIN' 
                })
            });

            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = './login.html';
            } else {
                alert('Erro no cadastro. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro no cadastro. Tente novamente.');
        }
    });
});
