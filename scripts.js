import { db } from "./db.js"

function main() {
  const FAKE_LOADING_DELAY = 400
  let startDate = new Date()

  const ui = {
    btnNext: document.querySelector("#btnNext"),
    btnPrevious: document.querySelector("#btnPrevious"),
    loadingIndicator: document.querySelector("#loadingIndicator"),
    divFooterButtons: document.querySelector(".step-buttons"),
    divFooterResult: document.querySelector(".result"),
    lblResultTime: document.querySelector(".result-time"),

    // step 1
    txtKidosPersonalNumber: document.querySelector("#st1PersonalNumber"),
    txtKidosFirstName: document.querySelector("#st1FirstName"),
    txtKidosLastName: document.querySelector("#st1LastName"),
    lblErrorStep1: document.querySelector("#errorDivMsgStep1"),

    // step 2
    cboParentType: document.querySelector("#st2ListParentType"),
    txtParentPersonalNumber: document.querySelector("#st2ParentPersonalNumber"),
    txtParentFirstName: document.querySelector("#st2ParentFirstName"),
    txtParentLastName: document.querySelector("#st2ParentLastName"),
    txtPhoneNumber: document.querySelector("#st2PhoneNumber"),
    txtEmail: document.querySelector("#stEmail"),
    lblErrorStep2: document.querySelector("#errorDivMsgStep2"),

    // step 3
    cboRegions: document.querySelector("#st3ListCity"),
    cboDistricts: document.querySelector("#st3ListBlock"),
    cboSchools: document.querySelector("#st3ListSchool"),
    cboSectors: document.querySelector("#st3ListSector"),
    cboShifts: document.querySelector("#st3ListShift"),
    lblErrorStep3: document.querySelector("#errorDivMsgStep3"),

    // step 4
    lblResultSchool: document.querySelector("#st4School"),
    lblResultKidsPersonalNumber: document.querySelector("#st4PersonalNumber"),
    lblResultKidsFirstName: document.querySelector("#st4FirstName"),
    lblResultKidsLastName: document.querySelector("#st4LastName"),
    lblResultRegistrator: document.querySelector("#st4Registrator"),
    lblResultParentFirstName: document.querySelector("#st4ParentName"),
    lblResultParentLastName: document.querySelector("#st4ParentSurname"),
    lblResultParentPhone: document.querySelector("#st4ParentPhone"),
    lblResultRegistrationCode: document.querySelector("#st4RegistrationCode"),
  }

  let currentTab = 1
  let isLoading = false
  ui.btnNext.addEventListener("click", () => {
    if (isLoading) {
      return
    }

    ui.lblErrorStep1.innerHTML = ""
    ui.lblErrorStep2.innerHTML = ""
    ui.lblErrorStep3.innerHTML = ""

    if (currentTab === 1) {
      checkKidosInfo()
    } else if (currentTab === 2) {
      checkParentInfo()
    } else if (currentTab === 3) {
      checkSchoolInfo()
    }
  })

  ui.btnPrevious.addEventListener("click", () => {
    if (isLoading) {
      return
    }
    setCurrentTab(currentTab - 1)
  })

  function setCurrentTab(tab) {
    if (tab > 1) {
      document.querySelector(`#aStep${tab - 1}`).classList.add("done")
      document.querySelector(`#aStep${tab - 1}`).classList.add("done")
      ui.btnPrevious.classList.remove("btn-disabled")
      ui.btnPrevious.disabled = false
    } else {
      ui.btnPrevious.classList.add("btn-disabled")
      ui.btnPrevious.disabled = true
    }

    if (tab < 4) {
      document.querySelector(`#aStep${tab + 1}`).classList.remove("selected")
      document.querySelector(`#aStep${tab + 1}`).classList.add("disabled")
    }

    document.querySelector(`#aStep${tab}`).classList.remove("done")
    document.querySelector(`#aStep${tab}`).classList.remove("disabled")
    document.querySelector(`#aStep${tab}`).classList.add("selected")

    document
      .querySelectorAll(".formContainerStep")
      .forEach((d) => (d.style.display = "none"))
    document.querySelector(`#formContainerStep${tab}`).style.display = "block"

    if (tab > currentTab) {
      isLoading = true
      ui.loadingIndicator.style.display = "flex"
      setTimeout(() => {
        isLoading = false
        ui.loadingIndicator.style.display = "none"

        if (tab === 4) {
          const diffMs = new Date() - startDate
          const totalSeconds = Math.floor(diffMs / 1000)
          const minutes = Math.floor(totalSeconds / 60)
          const seconds = totalSeconds % 60

          const formatted =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")

          ui.lblResultTime.innerHTML = formatted
          ui.divFooterButtons.style.display = "none"
          ui.divFooterResult.style.display = "flex"
        }
      }, FAKE_LOADING_DELAY)
    }

    currentTab = tab
  }

  function checkKidosInfo() {
    if (ui.txtKidosPersonalNumber.value.length != 11) {
      ui.lblErrorStep1.innerHTML = "ბავშვის პირადი ნომერი არასწორია!"
      return
    }

    if (ui.txtKidosFirstName.value.length === 0) {
      ui.lblErrorStep1.innerHTML = "შეიყვანე ბავშვის სახელი!"
      return
    }

    if (ui.txtKidosLastName.value.length === 0) {
      ui.lblErrorStep1.innerHTML = "შეიყვანე ბავშვის გვარი!"
      return
    }

    setCurrentTab(2)
  }

  function checkParentInfo() {
    if (ui.cboParentType.value == -1) {
      ui.lblErrorStep2.innerHTML = "აირჩიე მშობლის ტიპი!"
      return
    }

    if (ui.txtParentPersonalNumber.value === "") {
      ui.lblErrorStep2.innerHTML = "შეიყვანე მშობლის პირადი ნომერი!"
      return
    }

    if (ui.txtParentFirstName.value === "") {
      ui.lblErrorStep2.innerHTML = "შეიყვანე მშობლის სახელი!"
      return
    }

    if (ui.txtParentLastName.value === "") {
      ui.lblErrorStep2.innerHTML = "შეიყვანე მშობლის გვარი!"
      return
    }

    if (ui.txtPhoneNumber.value.length !== 9) {
      ui.lblErrorStep2.innerHTML = "შეიყვანე ტელეფონის ნომერი!"
      return
    }

    initRegions()
    setCurrentTab(3)
  }

  function randomString(length = 11) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("")
  }

  function checkSchoolInfo() {
    if (selectedRegion === null) {
      ui.lblErrorStep3.innerHTML = "აირჩიე ქალაქი!"
      return
    }

    if (selectedDistrict === null) {
      ui.lblErrorStep3.innerHTML = "აირჩიე სასკოლო უბანი!"
      return
    }

    if (selectedSchool === null) {
      ui.lblErrorStep3.innerHTML = "აირჩიე სკოლა!"
      return
    }

    if (selectedSector === null) {
      ui.lblErrorStep3.innerHTML = "აირჩიე სექტორი!"
      return
    }

    if (selectedShift === null) {
      ui.lblErrorStep3.innerHTML = "აირჩიე ცვლა!"
      return
    }

    ui.lblResultSchool.innerHTML = selectedSchool.schoolName

    ui.lblResultKidsPersonalNumber.innerHTML = ui.txtKidosPersonalNumber.value
    ui.lblResultKidsFirstName.innerHTML = ui.txtKidosFirstName.value
    ui.lblResultKidsLastName.innerHTML = ui.txtKidosLastName.value
    ui.lblResultRegistrator.innerHTML = ui.cboParentType.value
    ui.lblResultParentFirstName.innerHTML = ui.txtParentFirstName.value
    ui.lblResultParentLastName.innerHTML = ui.txtParentLastName.value
    ui.lblResultParentPhone.innerHTML = ui.txtPhoneNumber.value
    ui.lblResultRegistrationCode.innerHTML = randomString()

    setCurrentTab(4)
  }

  function initRegions() {
    let html = `<option value="-1" selected="selected">----აირჩიეთ----</option>`
    db.listRegions.forEach(
      (r, i) => (html += `<option value=${i}>${r.name}</option>`),
    )
    ui.cboRegions.innerHTML = html
    onRegionChanged()
  }

  function clearCombo(cbo) {
    cbo.innerHTML = `<option value="-1" selected="selected">----აირჩიეთ----</option>`
  }

  let selectedRegion = null
  let selectedDistrict = null
  let selectedSchool = null
  let selectedSector = null
  let selectedShift = null

  function onRegionChanged(e) {
    if (!e) {
      return
    }

    clearCombo(ui.cboDistricts)
    selectedDistrict = null

    const index = parseInt(e.target.value)
    if (index < 0) {
      onDistrictsChanged()
      return
    }

    selectedRegion = db.listRegions[index]

    let html = `<option value="-1" selected="selected">----აირჩიეთ----</option>`
    selectedRegion.listDistincts.forEach(
      (r, i) => (html += `<option value=${i}>${r.name}</option>`),
    )
    ui.cboDistricts.innerHTML = html
    onDistrictsChanged()
  }

  function onDistrictsChanged(e) {
    clearCombo(ui.cboSchools)
    selectedSchool = null
    onSchoolsChanged()

    if (!e) {
      return
    }

    const index = parseInt(e.target.value)
    if (index < 0) {
      return
    }

    selectedDistrict = selectedRegion.listDistincts[index]

    const listSchools = db.listSchools.result.filter(
      (s) => s.districtName === selectedDistrict.name,
    )
    let html = `<option value="-1" selected="selected">----აირჩიეთ----</option>`
    listSchools.forEach(
      (r, i) => (html += `<option value=${i}>${r.schoolName}</option>`),
    )
    ui.cboSchools.innerHTML = html
    onSchoolsChanged()
  }

  function onSchoolsChanged(e) {
    clearCombo(ui.cboSectors)
    selectedSector = null
    onSectorChanged()

    selectedSchool = null

    if (!e) {
      return
    }

    const index = parseInt(e.target.value)
    if (index < 0) {
      return
    }

    const listSchools = db.listSchools.result.filter(
      (s) => s.districtName === selectedDistrict.name,
    )
    selectedSchool = listSchools[index]

    let html = `
        <option value="-1" selected="selected">----აირჩიეთ----</option>
        <option value="0">ქართული</option>
    `
    ui.cboSectors.innerHTML = html
  }

  function onSectorChanged(e) {
    clearCombo(ui.cboShifts)
    onShiftChanged()

    selectedSector = null
    if (!e) {
      return
    }

    selectedSector = "ქართული"

    let html = `
        <option value="-1" selected="selected">----აირჩიეთ----</option>
        <option value="1">1</option>
    `
    ui.cboShifts.innerHTML = html
  }

  function onShiftChanged(e) {
    selectedShift = e ? parseInt(e.target.value) : null
  }

  ui.cboRegions.addEventListener("change", onRegionChanged)
  ui.cboDistricts.addEventListener("change", onDistrictsChanged)
  ui.cboSchools.addEventListener("change", onSchoolsChanged)
  ui.cboSectors.addEventListener("change", onSectorChanged)
  ui.cboShifts.addEventListener("change", onShiftChanged)
}

window.addEventListener("load", main)
