/**
 * @typedef {{what: string, who1: string, who2?: string}} PartialElf
 */

/**
 *  Lekérjük a tableselectort, és regisztrálunk egy change eseménykezelőt!
 */
const radioDiv = document.getElementById("tableselector");
radioDiv.addEventListener("change", handleRadioButtons);

function handleRadioButtons(event){
    const element = event.target;
    if (!element.checked || !element.value) return;
    hideElements();
    makeElementVisible(element.value);
}

function makeElementVisible(id){
    document.getElementById(id).classList.remove("hide");
}

function hideElements(){
    for (const i of document.body.querySelectorAll("div:has(table)")) i.classList.add("hide");
}

/**
 * Ez a függvény a javascript legvégén fut le, amikor már minden elem betöltött.
 * Első lépésben vizsgáljuk a checkbox értékét, és az alapján beállítjuk a többi elem
 * státuszát (ha nincs bepipálva akkor a mano2 és a muszak2 értéke nem engedélyezett)
 * Aztán feliratkozunk a change eseményre, hogy amikor változik a checkbox értéke,
 * akkor is frissüljenek a státuszok.
 * 
 * @param {HTMLInputElement} checkboxElem ami a formon belül helyezkedik el
 * @returns {void}
 */
function initCheckbox(checkboxElem){
    changeCheckboxValue(checkboxElem);
    checkboxElem.addEventListener("change", (e) => {changeCheckboxValue(checkboxElem)});
}

/**
 * 
 * A bemeneti checkbox értéke alapján állítja a formon belüli mano2 és muszak2 disabled
 * értékét. Ha nincs bepipálva a checkbox, akkor a disabled érték igaz lesz, tehát nem
 * módosíthatjuk őket.
 * Ha be van pipálva, akkor a disabled értéke false lesz, tehát a mezők módosíthatóak
 * a checkboxtól a formot a parentElementjének (div) a parentElementjén keresztül érjük
 * el, és a két beviteli mező azonosítója mano2 és muszak2
 * 
 * @param {HTMLInputElement} checkbox egy jelölőnégyzet
 * @returns {void}
 */
function changeCheckboxValue(checkbox){
    const parentParent = checkbox.parentElement.parentElement;
    parentParent.querySelector("#mano2").disabled = !checkbox.checked;
    parentParent.querySelector("#muszak2").disabled = !checkbox.checked;
}

/**
 * Segédfüggvény, aminek a segítségével elkérjük a htmlformon belüli 
 * manochooser azonosítójú elemet, ami tartalmazza az összes rendszerben létező manót
 * 
 * @returns {HTMLSelectElement}
 */
function getSelectElement() {
    const htmlForm = document.getElementById('htmlform');
    const select = htmlForm.querySelector('#manochooser');
    return select;
}

/**
 * 
 * A tömb alapján felépíti a dropdownlist opcióit.
 * Első lépésben töröljük az optionlist tartalmát, majd
 * létrehozunk egy opciót, aminek nincs value értéke,
 * a tartalma pedig "Válassz manót!" utána végigiterálunk
 * a bemeneti tömbön és hozzáfűzük a tömb who1 manóit az
 * optionlisthez. Amennyiben a who2 is definiálva van,
 * azt is hozzáfűzzük.
 * a függvény korán fut le, hiszen a dropdownlist a html-en
 * található 
 * 
 * @param {PartialElf[]} arr az adattömb, ami alapján felépítjük az opciókat
 * @returns {void}
 */
function initSelect(arr) {
    const select = getSelectElement();
    select.innerHTML = '';
    createoption(select, "Válassz Manót!"); // ez a függvény még nincs implementálva, görgess lejjebb
    for (const i in arr){
        createoption(select, arr[i].who1, arr[i].who1);
        if (arr[i].who2 !== undefined) createoption(select, arr[i].who2, arr[i].who2);
    }
}

/**
 * Létrehoz és hozzáfűz egy új optiont a selecthez
 * 
 * @param {HTMLSelectElement} selectElement a select element
 * @param {string} label az option tag közötti szöveg
 * @param {string} [value=""] az option value értéke, alapértelmezett értéke üres string
 * @returns {void}
 */
function createoption(selectElement, label, value = "") {
    const option = document.createElement("option");
    option.innerText = label;
    option.value = value;
    selectElement.appendChild(option);
}

/**
 * 
 * Ez a függvény azután fut le az eseménykezelőben,
 * miután a validáció sikeres volt, és összeállítottuk az objektumot.
 * Hasonlóan az inithez, az objektum who1 és a who2 (ha van) tulajdonság
 * alapján fűzzük hozzá a selecthez az új opciókat.
 * Ezután fűzzük hozzá az új elemet a tömb paraméterhez, majd meghívjuk a renderTbody
 * függvényt az array-el (ez a tömb alapján újrarendereli a táblázatot)
 * Végül töröljük az ürlap beviteli mezőinek a tartalmát.
 * Fontos, hogy a reset függvény után meghívjuk a {@link changeCheckboxValue} a checkbox elemmel,
 * mert change esemény nem keletkezik a form resetelésekor.
 * Az objektum abban az esetben, ha a "Két manót veszek fel" jelölő négyzet nincs bepipálva,
 * csak az első manó adatait tartalmazza, a másik manóhoz tartozó tulajdonságok nem definiáltak
 * 
 * @param {PartialElf} obj ez az összerakott elem
 * @param {HTMLFormElement} form az ürlap
 * @param {PartialElf[]} array az adattömb
 * @returns {void}
 */
function createNewElement(obj, form, array) {

    // ez egy ismerős rész, ehhez nem kell nyúlni
    const select = getSelectElement()
    createoption(select, obj.who1, obj.who1);
    if (obj.who2 != undefined) createoption(select, obj.who2, obj.who2);

    array.push(obj);
    renderTbody(array);
    form.reset();
    // ismerős rész vége
    changeCheckboxValue(document.getElementById("masodikmano"));
}

/**
 * 
 * Mivel a műszakválasztó 1,2 vagy 3 elemet vesz fel,
 * ezért ezt át kell alakítani olyan értékké, amit a 
 * felhasználónak meg szeretnénk jeleníteni. Ezt a függvényt
 * akkor hívjuk, amikor az objektumot összeállítjuk, mielőtt a
 * tömbbe beleraknánk.
 * Ha 1 az értéke akkor "Délelöttös", ha 2 akkor "Délutános", míg
 * 3 esetén az "Éjszakai" értékkel kell visszatérjen a függvény
 * 
 * @param {string} muszakValue az érték, amit a select optionjéből kapunk
 * @returns {string}
 */
function mapMuszak(muszakValue){
    switch (muszakValue){
        case "1": return "Délelöttös";
        case "2": return "Délutános";
        case "3": return "Éjszakai";
    }
    return muszakValue;
}