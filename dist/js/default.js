// Your application goes here
/*type FormField = {
    id: string;
    label?: string;
    legend?: string;
    name: string;
    type: string;
    required?: number;
    pattern?: string;
    options?: { id: string; label: string; value: string }[];
  };*/
const generateFormFromJson = function (formJson) {
    return `
        <div>
        ${formJson
            .map((field) => {
              if (field.type === "radio" && field.options) {
                return `
                  <fieldset>
                    <legend>${field.legend}</legend>
                    ${field.options
                      .map(
                        (option) => `
                        <label for="${option.id}">
                          <input type="radio" id="${option.id}" name="${field.name}" value="${option.value}" ${field.required ? "required" : ""}>
                          ${option.label}
                        </label>
                      `
                      )
                      .join("")}
                  </fieldset>
                `;
              } else {
                return `
                  <label for="${field.id}">${field.label}</label>
                  <input 
                    type="${field.type}" 
                    id="${field.id}" 
                    name="${field.name}" 
                    ${field.required ? "required" : ""} 
                    ${field.pattern ? `pattern="${field.pattern}"` : ""}
                    oninput="validateField(this)">
                  <span class="error-message" id="error-${field.id}"></span>
                `;
              }
            })
            .join("")}
          <button type="submit">Submit</button>
        </div>
    `;
}
const validateField = function (input) {
    const errorSpan = document.getElementById('error-' + input.id);
    if(!errorSpan) {
        return
    }
    if (!input.checkValidity()) {
        errorSpan.textContent = input.validationMessage;
    } else {
        errorSpan.textContent = '';
    }
}
async function onload() {
    const formRespose = await fetch('/form.json');
    const formJson = await formRespose.json();
    const form = document.getElementsByTagName('form')[0];
    form.innerHTML = generateFormFromJson(formJson);
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let isValid = true;
        const formData = [];
        this.querySelectorAll("input").forEach(input => {
            validateField(input);
            let elementData = {};
            if (!input.checkValidity()) {
                isValid = false;
            }
            if (input.type === "radio") {
                if (input.checked) {
                    elementData.name = input.name;
                    elementData.value = input.value;
                    formData.push(elementData);
                }
            } else {
                elementData.name = input.name;
                elementData.value = input.value;
                formData.push(elementData);
            }
        });
        if (isValid) {
            try {
                const response = await fetch("/submitForm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if(response.ok) {
                    document.getElementById("formSubmittionMessage").innerText = result.message;
                } else {
                    document.getElementById("formSubmittionMessage").innerHTML = `<span style="color:red">${result.message}</span>`;
                }
                console.log("Success:", result);
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    });
}
window.document.onload = onload();