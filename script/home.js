document.addEventListener("DOMContentLoaded", function () {

  function viewSite(entry) {
    // Redirecionar para a página site_details.html com o ID do site como parâmetro
    window.location.href = `site_details.html?id=${entry.id}`;
}

  
    function searchSite() {
      const searchInput = document.getElementById("searchInput");
      const searchInputValue = searchInput.value.trim();
  
      if (searchInputValue === "") {
        window.location.href = "./home.html";
        return;
      }
  
      fetch(`http://localhost:8080/api/sites/${searchInputValue}`)
        .then(handleFetchResponse)
        .then(data => updateTable([data]))
        .catch(showError);
    }
  
    function handleFetchResponse(response) {
      if (!response.ok) {
        throw new Error("Erro ao obter o site");
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return response.text();
      }
    }
  
    function showError(error) {
      console.error("Erro:", error);
      alert("Ocorreu um erro: " + error.message);
    }
  
    function createButton(text, onClickHandler) {
      const button = document.createElement("button");
      button.textContent = text;
      button.addEventListener("click", onClickHandler);
      return button;
    }
  
    function updateTable(data) {
      const tableBody = document.querySelector("#passwordTable tbody");
      tableBody.innerHTML = "";
      data.forEach(entry => {
        const row = document.createElement("tr");
  
        // Coluna do favicon
        const faviconCell = document.createElement("td");
        const faviconImg = document.createElement("img");
        faviconImg.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${entry.url}`;
        faviconCell.appendChild(faviconImg);
        row.appendChild(faviconCell);
  
        // Coluna do nome do site
        const nameCell = document.createElement("td");
        nameCell.textContent = entry.name;
        row.appendChild(nameCell);
  
        // Coluna das ações
        const actionsCell = document.createElement("td");
        const viewButton = createButton("Visualizar", () => viewSite(entry));
        actionsCell.appendChild(viewButton);
        row.appendChild(actionsCell);
  
        tableBody.appendChild(row);
      });
  
      updateSiteCount(data.length);
    }

    let viewPopup;
    
    function viewSite(site) {
        const siteInfo = `
          <h2>Informações do Site</h2>
          <p><strong>Nome:</strong> ${site.name}</p>
          <p><strong>URL:</strong> ${site.url}</p>
          <p><strong>Usuário:</strong> ${site.username}</p>
          <p><strong>Senha:</strong> ${site.password}</p>
          <p><strong>Nota:</strong> ${site.note}</p>
        `;
      
        const editButton = createButton("Editar", () => editSite(site));
        const deleteButton = createButton("Deletar", () => deleteSite(site));
      
        const actions = document.createElement("div");
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
      
        viewPopup = window.open("", "Informações do Site", "width=400,height=300");
        viewPopup.document.body.innerHTML = siteInfo;
        viewPopup.document.body.appendChild(actions);
      }
  
    function editSite(site) {
        const editForm = `
          <form id="editForm">
            <label for="editName">Nome:</label><br>
            <input type="text" id="editName" name="editName" value="${site.name}" required><br>
            <label for="editURL">URL:</label><br>
            <input type="url" id="editURL" name="editURL" value="${site.url}" required><br>
            <label for="editUsername">Usuário:</label><br>
            <input type="text" id="editUsername" name="editUsername" value="${site.username}" required><br>
            <label for="editPassword">Senha:</label><br>
            <input type="text" id="editPassword" name="editPassword" value="${site.password}" required><br>
            <label for="editNote">Nota:</label><br>
            <textarea id="editNote" name="editNote">${site.note}</textarea><br><br>
            <button type="submit">Salvar</button>
          </form>
        `;
    
        const popup = window.open("", "Editar Site", "width=400,height=400");
        popup.document.body.innerHTML = editForm;
    
        popup.document.getElementById("editForm").addEventListener("submit", function (event) {
          event.preventDefault();
          const editedData = {
            name: popup.document.getElementById("editName").value,
            url: popup.document.getElementById("editURL").value,
            username: popup.document.getElementById("editUsername").value,
            password: popup.document.getElementById("editPassword").value,
            note: popup.document.getElementById("editNote").value
          };
    
          fetch(`http://localhost:8080/api/sites/${site.name}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(editedData)
          })
            .then(handleFetchResponse)
            .then(() => {
              console.log("Dados do site atualizados com sucesso!");
              popup.close();
              getSitesData();
            })
            .catch(error => {
              console.error("Erro:", error);
              popup.alert("Erro ao atualizar os dados do site. Por favor, tente novamente.");
            });
        });

        if (viewPopup) {
            viewPopup.close(); // Fecha o popup de visualização se estiver aberto
          }
    }
    
    function deleteSite(site) {
        fetch(`http://localhost:8080/api/sites/${site.name}`, {
          method: "DELETE",
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Erro ao deletar o site");
            }
            return response.text();  // Expecting a text response
          })
          .then(() => {
            console.log("Site deletado com sucesso!");
            getSitesData();
          })
          .catch(showError);

          if (viewPopup) {
            viewPopup.close(); // Fecha o popup de visualização se estiver aberto
          }
    }
  
    function getSitesData() {
      fetch("http://localhost:8080/api/sites")
        .then(handleFetchResponse)
        .then(updateTable)
        .catch(showError);
    }

   
  
    function updateSiteCount(count) {
      const siteCountElement = document.getElementById("siteCount");
      siteCountElement.textContent = `${count} `;
    }
  
    const addSiteButton = document.getElementById("addSiteButton");
  
    if (addSiteButton) {
      addSiteButton.addEventListener("click", showAddSiteForm);
    }
  
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
  
    if (searchButton) {
      searchButton.addEventListener("click", searchSite);
    }
  
    if (searchInput) {
      searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          searchSite();
        }
      });
    }
  
    function showAddSiteForm() {
      const addForm = `
        <form id="addForm">
          <label for="addName">Nome:</label><br>
          <input type="text" id="addName" name="addName" required><br>
          <label for="addURL">URL:</label><br>
          <input type="url" id="addURL" name="addURL" required><br>
          <label for="addUsername">Usuário:</label><br>
          <input type="text" id="addUsername" name="addUsername" required><br>
          <label for="addPassword">Senha:</label><br>
          <input type="text" id="addPassword" name="addPassword" required><br>
          <label for="addNote">Nota:</label><br>
          <textarea id="addNote" name="addNote"></textarea><br><br>
          <button type="submit">Adicionar</button>
        </form>
      `;
  
      const popup = window.open("", "Adicionar Site", "width=400,height=400");
      popup.document.body.innerHTML = addForm;
  
      popup.document.getElementById("addForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const newData = {
          name: popup.document.getElementById("addName").value,
          url: popup.document.getElementById("addURL").value,
          username: popup.document.getElementById("addUsername").value,
          password: popup.document.getElementById("addPassword").value,
          note: popup.document.getElementById("addNote").value
        };
  
        fetch("http://localhost:8080/api/sites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newData)
        })
          .then(handleFetchResponse)
          .then(() => {
            console.log("Novo site adicionado com sucesso!");
            popup.close();
            getSitesData();
          })
          .catch(error => {
            console.error("Erro:", error);
            popup.alert("Erro ao adicionar o novo site. Por favor, tente novamente.");
          });
      });
    }
    
    
    getSitesData();
  });
  
  