/**
 * @typedef {string[]} TableHeader
 * @typedef {{what: string, who1: string, shift1: string, who2?: string, shift2?: string}[]} TableData
 * @typedef {{value: string, label: string}[]} Options
 * @typedef {{id: string, label: string, name: string, type?: string, optionList?: Options}} InputFieldData
 * @typedef {{id: string, label: string, name: string, type?: string, optionList?: {value: string, label: string}[]}[]} InputFieldDataArray
 */

/**
 * @type {TableHeader}
 */
const header = ["Osztály", "Manó", "Műszak"];
/**
 * @type {TableData}
 */
const data = [
    {
        what: "Logisztika",
        who1: "Kovács Máté",
        shift1: "Délelöttös",
        who2: "Kovács József",
        shift2: "Délutános"
    }, {
        what: "Könyvelés",
        who1: "Szabó Anna",
        shift1: "Éjszakai"
    }, {
        what: "Játékfejlesztés",
        who1: "Varga Péter",
        shift1: "Délutános",
        who2: "Nagy Eszter",
        shift2: "Éjszakai"
    }
];

const inputData = [
    {
        id: "osztaly",
        label: "Osztály",
        name: "osztaly"
    }, {
        id: "mano1",
        label: "Manó 1",
        name: "mano1"
    }, {
        id: "muszak1",
        label: "Manó 1 műszak",
        name: "muszak1",
        type: "select",
        optionList: [
            {
              value: "",
              label: "Válassz műszakot!"
            },
            {
                value: "1",
                label: "Délelöttös"
            }, {
                value: "2",
                label: "Délutános"
            }, {
                value: "3",
                label: "Éjszakai"
            }
        ]
    }, {
        id: "masodikmano",
        label: "Két manót veszek fel",
        name: "masodikmano",
        type: "checkbox"
    }, {
        id: "mano2",
        label: "Manó 2",
        name: "mano2"
    }, {
        id: "muszak2",
        label: "Manó 2 műszak",
        name: "muszak2",
        type: "select",
        optionList: [
            {
                value: "",
                label: "Válassz műszakot!"
            },
            {
                value: "1",
                label: "Délelöttös"
            }, {
                value: "2",
                label: "Délutános"
            }, {
                value: "3",
                label: "Éjszakai"
            }
        ]
    }
]

createJsSection();
createTable();
renderTableBody(data);
createForm(inputData);
initSelect(data);
initCheckbox(document.getElementById("masodikmano"));

// ----- EVENT -----
/**
 * @param {Event} event
 * @return {void}
 */
function AddRowToHTML(event){
    event.preventDefault();
    /**
     * @type {HTMLFormElement}
     */
    const element = event.target;
    /**
     * @type {HTMLInputElement[]}
     */
    let inputs = [];

    inputs.push(element.querySelector("#osztaly"));
    inputs.push(element.querySelector("#mano1"));
    inputs.push(element.querySelector("#muszak1"));
    inputs.push(element.querySelector("#mano2"));
    inputs.push(element.querySelector("#muszak2"));

    // Validation and error message handling
    if (!validateFields(inputs[0], inputs[1], inputs[2])) return;
    const spans = element.querySelectorAll(".error");
    for (const span of spans){span.innerText = "";}

    /**
     * @type {TableData}
     */
    const partialElf = {
        what: inputs[0].value,
        who1: inputs[1].value,
        who2: !inputs[3].value ? undefined : inputs[3].value
    }
    const dataStruct = [{
        what: partialElf.what,
        who1: partialElf.who1,
        shift1: mapMuszak(inputs[2].value),
        who2: partialElf.who2,
        shift2: !inputs[4].value ? undefined : mapMuszak(inputs[4].value)
    }];
    const tbody = document.getElementById("jstbody");
    AddRow(dataStruct, tbody, 0)
    createNewElement(partialElf, element, data);
    element.reset();
}

// ----- VALIDATION -----
/**
 * Validates 3 fields
 * @param {HTMLInputElement} osztaly
 * @param {HTMLInputElement} mano1
 * @param {HTMLInputElement} mano1Muszak
 * @return {boolean}
 */
function validateFields(osztaly, mano1, mano1Muszak){
    let validFlag = true;
    if (!validateField(osztaly, "Kötelező kitölteni")) validFlag = false;
    if (!validateField(mano1, "Kötelező kitölteni")) validFlag = false;
    if (!validateField(mano1Muszak, "Kötelező kitölteni")) validFlag = false;
    return validFlag;
}

/**
 * Validates one field, and put out the error message into the parent span
 * @param {HTMLInputElement} htmlInputField
 * @param {string} errorMessage
 */
function validateField(htmlInputField, errorMessage){
    let validFlag = true;
    if (!htmlInputField.value) {
        validFlag = false;
        let span = htmlInputField.parentElement.querySelector(".error")
        span.innerText = errorMessage;
    }
    return validFlag;
}

// ----- CREATE FORM -----
/**
 * @param {InputFieldDataArray} inputFieldDataArr
 * @return {void}
 */
function createForm(inputFieldDataArr){
    const jsSectionDiv = document.getElementById("jssection");
    const form = document.createElement("form");
    form.id = "jsform";
    form.addEventListener("submit", AddRowToHTML)
    jsSectionDiv.appendChild(form);
    createFormFields(inputFieldDataArr);
    const button = document.createElement("button");
    button.innerText = "Hozzaadas";
    form.appendChild(button);
}

/**
 * @param {InputFieldDataArray} inputFieldDataArr
 * @return {void}
 */
function createFormFields(inputFieldDataArr){
    for (const i in inputFieldDataArr){
        if (!inputFieldDataArr[i].type){
            createInputTextField(inputFieldDataArr[i]);
        }
        else if (inputFieldDataArr[i].type == "select"){
            createInputSelectField(inputFieldDataArr[i]);
        }
        else if (inputFieldDataArr[i].type == "checkbox"){
            createCheckboxField(inputFieldDataArr[i]);
        }
    }
}

/**
 * @param {InputFieldData} inputFieldData
 * @return {void}
 */
function createInputTextField(inputFieldData){
    const form = document.getElementById("jsform");
    const div = document.createElement("div");

    const label = document.createElement("label");
    label.htmlFor = inputFieldData.id;
    label.innerText = inputFieldData.label;
    const input = document.createElement("input");
    input.id = inputFieldData.id;
    input.name = inputFieldData.name;
    const span = document.createElement("span");
    span.classList.add("error");

    div.appendChild(label);
    div.appendChild(document.createElement("br"));
    div.appendChild(input);
    div.appendChild(document.createElement("br"));
    div.appendChild(span);

    form.appendChild(div);
}

/**
 * @param {InputFieldData} inputFieldData
 * @return {void}
 */
function createInputSelectField(inputFieldData){
    const form = document.getElementById("jsform");
    const div = document.createElement("div");

    const label = document.createElement("label");
    label.htmlFor = inputFieldData.id;
    label.innerText = inputFieldData.label;
    const select = document.createElement("select");
    select.id = inputFieldData.id;
    createOptions(inputFieldData.optionList, select);
    const span = document.createElement("span");
    span.classList.add("error");

    div.appendChild(label);
    div.appendChild(document.createElement("br"));
    div.appendChild(select);
    div.appendChild(span);

    form.appendChild(div);
}

/**
 * @type {Options} optionArr
 * @type {HTMLSelectElement} selectElement
 * @return {void}
 */
function createOptions(optionArr, selectElement){
    let option;
    for (const i in optionArr){
        option = document.createElement("option");
        option.value = optionArr[i].value;
        option.innerText = optionArr[i].label;
        selectElement.appendChild(option);
    }
}

/**
 * @param {InputFieldData} inputFieldData
 * @return {void}
 */
function createCheckboxField(inputFieldData){
    const form = document.getElementById("jsform");
    const div = document.createElement("div");

    const label = document.createElement("label");
    label.htmlFor = inputFieldData.id;
    label.innerText = inputFieldData.label;
    const input = document.createElement("input");
    input.id = inputFieldData.id;
    input.name = inputFieldData.name;
    input.type = inputFieldData.type;
    const span = document.createElement("span");
    span.classList.add("error");

    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(span);

    form.appendChild(div);
}

// ----- CREATE TABLE -----
/**
 * @return {void}
 */
function createJsSection(){
    const jsSectionDiv = document.createElement("div");
    jsSectionDiv.id = "jssection";
    document.body.appendChild(jsSectionDiv);
}

/**
 * @return {void}
 */
function createTable(){
    const jsSectionDiv = document.getElementById("jssection");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    GenerateHeader(thead, header);
    const tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);
    jsSectionDiv.appendChild(table);
    tbody.id = "jstbody"
}

/**
 * @param {TableData} headerData
 * @param {HTMLTableSectionElement} thead
 * @return {void}
 */
function GenerateHeader(thead, headerData){
    const tr = document.createElement("tr");
    let th;
    for (const index in headerData){
        th = document.createElement("th");
        th.innerText = headerData[index];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
}

/**
 * @param {TableData} data
 * @return {void}
 */
function renderTableBody(data){
    const tbody = document.getElementById("jstbody");
    tbody.innerHTML = "";
    // Generate table
    for (const i in data){
        AddRow(data, tbody, i);
    }
}

/**
 *
 * @param {TableData} data
 * @param {HTMLTableSectionElement} tbody
 * @param {number} index
 * @return {void}
 */
function AddRow(data, tbody, index){
    let tr; let tr2;
    tr = document.createElement("tr");
    tr2 = document.createElement("tr");
    // Create rows
    GenerateRows(data[index], tr, tr2);
    // Add to table
    tbody.appendChild(tr);
    if (tr2.querySelector("td")){
        tbody.appendChild(tr2);
    }
}

/**
 *
 * @param {TableData} data
 * @param {HTMLTableRowElement} tr
 * @param {HTMLTableRowElement} tr2
 * @return {void}
 */
function GenerateRows(data, tr, tr2){
    let td;
    for (const j in data){
        if (data.who2 && data.shift2 && (j === "who2" || j === "shift2")){
            td = createTableCell("td", data[j], tr2);
        }
        else if (j !== "who2" && j !== "shift2"){
            td = createTableCell("td", data[j], tr);
            if (data.who2 && data.shift2 && (j === "what")) td.rowSpan = 2;
        }
    }
}

/**
 *
 * @param {string} type
 * @param {string} cellData
 * @param {HTMLTableRowElement} parentRow
 * @return {HTMLTableCellElement}
 */
function createTableCell(type, cellData, parentRow){
    /**
     * @type {HTMLTableCellElement}
     */
    const cell = document.createElement(type);
    cell.innerText = cellData;
    parentRow.appendChild(cell);

    return cell;
}