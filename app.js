/**
 * Kyndryl Year End Celebrations 2026 - Main Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    activeTab: "registerTab",
    registrations: [],
    stats: null,
    searchDebounceTimer: null,
    selectedRecordForModal: null,
    adminToken: sessionStorage.getItem("kyndryl_admin_token") || null,
  };

  // DOM Elements - Navigation
  const tabBtnRegister = document.getElementById("tabBtnRegister");
  const tabBtnAdmin = document.getElementById("tabBtnAdmin");
  const registerTab = document.getElementById("registerTab");
  const adminTab = document.getElementById("adminTab");
  const badgeAttendanceCounter = document.getElementById("badgeAttendanceCounter");
  const badgeAdminRestricted = document.getElementById("badgeAdminRestricted");

  // DOM Elements - Registration Form
  const registrationForm = document.getElementById("registrationForm");
  const fullNameInput = document.getElementById("fullName");
  const officialEmailInput = document.getElementById("officialEmail");
  const mobileNumberInput = document.getElementById("mobileNumber");
  const emergencyContactInput = document.getElementById("emergencyContact");
  const safetyWarningBanner = document.getElementById("safetyWarningBanner");
  const formAlertBox = document.getElementById("formAlertBox");
  const btnSubmitRegistration = document.getElementById("btnSubmitRegistration");
  const emailMsg = document.getElementById("emailMsg");

  // DOM Elements - Shareable Link
  const shareableUrlText = document.getElementById("shareableUrlText");
  const btnCopyShareLink = document.getElementById("btnCopyShareLink");
  const copyShareIcon = document.getElementById("copyShareIcon");
  const copyShareText = document.getElementById("copyShareText");

  // DOM Elements - Travel Mode & Safety
  const travelModeSection = document.getElementById("travelModeSection");
  const travelRequiredStar = document.getElementById("travelRequiredStar");
  const travelStatusBadge = document.getElementById("travelStatusBadge");
  const travelHintText = document.getElementById("travelHintText");
  const selfDriveCardWrapper = document.getElementById("selfDriveCardWrapper");
  const travelSelfDrive = document.getElementById("travelSelfDrive");
  const selfDriveProhibitedBadge = document.getElementById("selfDriveProhibitedBadge");
  const travelModeMsg = document.getElementById("travelModeMsg");

  // DOM Elements - Mandatory Verifications
  const confirmAttendance = document.getElementById("confirmAttendance");
  const acceptTerms = document.getElementById("acceptTerms");
  const confirmAttendanceMsg = document.getElementById("confirmAttendanceMsg");
  const acceptTermsMsg = document.getElementById("acceptTermsMsg");

  // DOM Elements - Restricted Admin Authentication
  const adminAuthGate = document.getElementById("adminAuthGate");
  const adminDashboardContent = document.getElementById("adminDashboardContent");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminPasskeyInput = document.getElementById("adminPasskeyInput");
  const adminLoginAlert = document.getElementById("adminLoginAlert");
  const btnLogoutAdmin = document.getElementById("btnLogoutAdmin");

  // DOM Elements - Admin Dashboard
  const btnSeedData = document.getElementById("btnSeedData");
  const btnRefreshStats = document.getElementById("btnRefreshStats");
  const btnExportCsv = document.getElementById("btnExportCsv");
  const quickCheckinForm = document.getElementById("quickCheckinForm");
  const quickCheckinInput = document.getElementById("quickCheckinInput");
  const checkinResultAlert = document.getElementById("checkinResultAlert");

  const statTotalRegistrations = document.getElementById("statTotalRegistrations");
  const statTotalAttended = document.getElementById("statTotalAttended");
  const statAttendancePercent = document.getElementById("statAttendancePercent");
  const statRemaining = document.getElementById("statRemaining");
  const statEmailsSent = document.getElementById("statEmailsSent");

  const dietaryStatsList = document.getElementById("dietaryStatsList");
  const alcoholStatsList = document.getElementById("alcoholStatsList");
  const travelStatsList = document.getElementById("travelStatsList");

  // Filter Elements
  const filterSearch = document.getElementById("filterSearch");
  const filterName = document.getElementById("filterName");
  const filterEmail = document.getElementById("filterEmail");
  const filterAttendance = document.getElementById("filterAttendance");
  const filterDietary = document.getElementById("filterDietary");
  const filterAlcohol = document.getElementById("filterAlcohol");
  const filterTravel = document.getElementById("filterTravel");
  const btnResetFilters = document.getElementById("btnResetFilters");
  const rosterTableBody = document.getElementById("rosterTableBody");
  const rosterEmptyState = document.getElementById("rosterEmptyState");
  const rosterCountText = document.getElementById("rosterCountText");

  // Modal Elements - Digital Pass
  const passModal = document.getElementById("passModal");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const modalTicketCode = document.getElementById("modalTicketCode");
  const modalAvatar = document.getElementById("modalAvatar");
  const modalName = document.getElementById("modalName");
  const modalEmail = document.getElementById("modalEmail");
  const modalConfirmedEmail = document.getElementById("modalConfirmedEmail");
  const modalAttendanceBadge = document.getElementById("modalAttendanceBadge");
  const modalMobile = document.getElementById("modalMobile");
  const modalEmergency = document.getElementById("modalEmergency");
  const modalDiet = document.getElementById("modalDiet");
  const modalAlcohol = document.getElementById("modalAlcohol");
  const modalConfirmedAttendance = document.getElementById("modalConfirmedAttendance");
  const modalAcceptedTerms = document.getElementById("modalAcceptedTerms");
  const modalTravel = document.getElementById("modalTravel");
  const eligibilityTicketCode = document.getElementById("eligibilityTicketCode");
  const ticketQrCanvas = document.getElementById("ticketQrCanvas");
  const btnPrintTicket = document.getElementById("btnPrintTicket");
  const btnSwitchToAdmin = document.getElementById("btnSwitchToAdmin");
  const btnViewSentEmail = document.getElementById("btnViewSentEmail");
  const toastContainer = document.getElementById("toastContainer");

  // Modal Elements - Email Preview
  const emailPreviewModal = document.getElementById("emailPreviewModal");
  const btnCloseEmailModal = document.getElementById("btnCloseEmailModal");
  const btnCloseEmailModalBtn = document.getElementById("btnCloseEmailModalBtn");
  const emailPreviewSubject = document.getElementById("emailPreviewSubject");
  const emailPreviewTo = document.getElementById("emailPreviewTo");
  const emailPreviewDate = document.getElementById("emailPreviewDate");
  const emailPreviewContent = document.getElementById("emailPreviewContent");

  // Modal Elements - Attendee Details (Admin)
  const attendeeDetailsModal = document.getElementById("attendeeDetailsModal");
  const btnCloseAttendeeDetails = document.getElementById("btnCloseAttendeeDetails");
  const btnCloseAttendeeDetailsBtn = document.getElementById("btnCloseAttendeeDetailsBtn");
  const detailAvatar = document.getElementById("detailAvatar");
  const detailFullName = document.getElementById("detailFullName");
  const detailEmail = document.getElementById("detailEmail");
  const detailTicketCode = document.getElementById("detailTicketCode");
  const detailMobile = document.getElementById("detailMobile");
  const detailEmergency = document.getElementById("detailEmergency");
  const detailDiet = document.getElementById("detailDiet");
  const detailAlcohol = document.getElementById("detailAlcohol");
  const detailTravel = document.getElementById("detailTravel");
  const detailAttendanceStatus = document.getElementById("detailAttendanceStatus");
  const detailVerificationMethod = document.getElementById("detailVerificationMethod");
  const detailVerificationNotes = document.getElementById("detailVerificationNotes");
  const btnToggleAttendanceInModal = document.getElementById("btnToggleAttendanceInModal");
  let selectedAttendeeDetailId = null;

  // Entrance Desk & Attendance Management Elements (Requirement 3)
  const tabPrimaryVerification = document.getElementById("tabPrimaryVerification");
  const tabAlternativeVerification = document.getElementById("tabAlternativeVerification");
  const panelPrimaryVerification = document.getElementById("panelPrimaryVerification");
  const panelAlternativeVerification = document.getElementById("panelAlternativeVerification");
  const btnPrimaryVerifyOnly = document.getElementById("btnPrimaryVerifyOnly");
  const altCheckinForm = document.getElementById("altCheckinForm");
  const altLookupType = document.getElementById("altLookupType");
  const altLookupValue = document.getElementById("altLookupValue");
  const altBadgeConfirmed = document.getElementById("altBadgeConfirmed");
  const altNotes = document.getElementById("altNotes");
  const btnAltVerifyOnly = document.getElementById("btnAltVerifyOnly");
  const entranceEligibilityCard = document.getElementById("entranceEligibilityCard");

  // =========================================================================
  // NAVIGATION & TABS
  // =========================================================================
  function updateAdminViewState() {
    if (state.adminToken) {
      if (adminAuthGate) adminAuthGate.classList.add("hidden");
      if (adminDashboardContent) adminDashboardContent.classList.remove("hidden");
      if (badgeAdminRestricted) badgeAdminRestricted.classList.add("hidden");
      if (badgeAttendanceCounter) badgeAttendanceCounter.classList.remove("hidden");
    } else {
      if (adminAuthGate) adminAuthGate.classList.remove("hidden");
      if (adminDashboardContent) adminDashboardContent.classList.add("hidden");
      if (badgeAdminRestricted) badgeAdminRestricted.classList.remove("hidden");
      if (badgeAttendanceCounter) badgeAttendanceCounter.classList.add("hidden");
      if (adminPasskeyInput) adminPasskeyInput.value = "";
    }
  }

  function switchTab(targetTabId) {
    state.activeTab = targetTabId;

    if (targetTabId === "registerTab") {
      tabBtnRegister.classList.add("active");
      tabBtnRegister.setAttribute("aria-selected", "true");
      tabBtnAdmin.classList.remove("active");
      tabBtnAdmin.setAttribute("aria-selected", "false");
      registerTab.classList.add("active");
      adminTab.classList.remove("active");
    } else {
      tabBtnAdmin.classList.add("active");
      tabBtnAdmin.setAttribute("aria-selected", "true");
      tabBtnRegister.classList.remove("active");
      tabBtnRegister.setAttribute("aria-selected", "false");
      adminTab.classList.add("active");
      registerTab.classList.remove("active");
      updateAdminViewState();
      if (state.adminToken) {
        loadAdminData();
      }
    }
  }

  tabBtnRegister.addEventListener("click", () => switchTab("registerTab"));
  tabBtnAdmin.addEventListener("click", () => switchTab("adminTab"));
  btnSwitchToAdmin.addEventListener("click", () => {
    closePassModal();
    switchTab("adminTab");
  });

  // Toggle password visibility on admin login input
  const btnTogglePasskeyVisibility = document.getElementById("btnTogglePasskeyVisibility");
  if (btnTogglePasskeyVisibility && adminPasskeyInput) {
    btnTogglePasskeyVisibility.addEventListener("click", () => {
      if (adminPasskeyInput.type === "password") {
        adminPasskeyInput.type = "text";
        btnTogglePasskeyVisibility.textContent = "🙈";
        btnTogglePasskeyVisibility.title = "Hide passkey";
      } else {
        adminPasskeyInput.type = "password";
        btnTogglePasskeyVisibility.textContent = "👁️";
        btnTogglePasskeyVisibility.title = "Show passkey";
      }
    });
  }

  // Admin Login Form
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const passkey = adminPasskeyInput.value.trim();
      adminLoginAlert.classList.add("hidden");
      adminLoginAlert.textContent = "";

      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passkey }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Authentication failed.");
        }

        state.adminToken = json.token;
        sessionStorage.setItem("kyndryl_admin_token", json.token);
        showToast("Administrator access granted.", "success");
        updateAdminViewState();
        loadAdminData();
      } catch (err) {
        adminLoginAlert.textContent = err.message;
        adminLoginAlert.classList.remove("hidden");
      }
    });
  }

  if (btnLogoutAdmin) {
    btnLogoutAdmin.addEventListener("click", () => {
      state.adminToken = null;
      sessionStorage.removeItem("kyndryl_admin_token");
      updateAdminViewState();
      showToast("Logged out of administrator interface.", "info");
    });
  }

  // =========================================================================
  // SHAREABLE REGISTRATION LINK & ROUTING
  // =========================================================================
  const shareableUrl = `${window.location.origin}/register`;
  if (shareableUrlText) {
    shareableUrlText.textContent = shareableUrl;
  }

  if (btnCopyShareLink) {
    btnCopyShareLink.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareableUrl);
        } else {
          const tempInput = document.createElement("input");
          tempInput.value = shareableUrl;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }
        if (copyShareIcon) copyShareIcon.textContent = "✅";
        if (copyShareText) copyShareText.textContent = "Copied!";
        btnCopyShareLink.classList.add("btn-success");
        showToast("Shareable registration link copied to clipboard!", "success");
        setTimeout(() => {
          if (copyShareIcon) copyShareIcon.textContent = "📋";
          if (copyShareText) copyShareText.textContent = "Copy Link";
          btnCopyShareLink.classList.remove("btn-success");
        }, 2500);
      } catch (err) {
        showToast("Failed to copy link automatically. URL: " + shareableUrl, "info");
      }
    });
  }

  // Check URL pathname/query/hash on load for direct registration link
  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  if (
    currentPath === "/register" ||
    currentPath === "/register/" ||
    currentPath === "/registration" ||
    urlParams.get("tab") === "register" ||
    window.location.hash === "#register"
  ) {
    switchTab("registerTab");
  }

  // =========================================================================
  // REAL-TIME VALIDATION & SAFETY RULES
  // =========================================================================

  // Email format & domain check
  function validateEmailDomain(email) {
    const trimmed = email.trim().toLowerCase();
    const pattern = /^[a-zA-Z0-9_.+-]+@kyndryl\.com$/;
    return pattern.test(trimmed);
  }

  officialEmailInput.addEventListener("input", () => {
    const val = officialEmailInput.value.trim().toLowerCase();
    if (!val) {
      officialEmailInput.classList.remove("valid-field", "invalid-field");
      emailMsg.textContent = "Domain validation: must end with @kyndryl.com";
      emailMsg.className = "field-msg";
      return;
    }

    if (validateEmailDomain(val)) {
      officialEmailInput.classList.add("valid-field");
      officialEmailInput.classList.remove("invalid-field");
      emailMsg.textContent = "✓ Verified Kyndryl employee domain";
      emailMsg.className = "field-msg msg-success";
    } else {
      officialEmailInput.classList.remove("valid-field");
      officialEmailInput.classList.add("invalid-field");
      emailMsg.textContent = "✗ Only official @kyndryl.com emails are accepted";
      emailMsg.className = "field-msg msg-error";
    }
  });

  function getSelectedRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  }

  // Business Rule: Travel Mode enforcement & Drinking + Self Drive Prohibition
  function checkSafetyPolicyRule() {
    const alcoholPref = getSelectedRadioValue("alcoholPref");
    const isDrinking = alcoholPref === "Yes";
    const travelMode = getSelectedRadioValue("travelMode");

    if (isDrinking) {
      // Travel Mode is mandatory for drinking
      if (travelRequiredStar) travelRequiredStar.classList.remove("hidden");
      if (travelStatusBadge) {
        travelStatusBadge.textContent = "Mandatory for Alcohol Consumers";
        travelStatusBadge.className = "travel-status-badge badge-mandatory";
      }
      if (travelHintText) {
        travelHintText.textContent =
          "⚠️ Mandatory: Since you indicated you will be drinking, selecting an approved mode of travel is required. Self-drive is prohibited.";
      }

      // Self Drive is strictly prohibited
      if (travelSelfDrive) travelSelfDrive.disabled = true;
      if (selfDriveCardWrapper) selfDriveCardWrapper.classList.add("disabled-option");
      if (selfDriveProhibitedBadge) selfDriveProhibitedBadge.classList.remove("hidden");

      // If Self-Drive was previously selected, uncheck it automatically
      if (travelSelfDrive && travelSelfDrive.checked) {
        travelSelfDrive.checked = false;
        showToast(
          "Self-Drive deselected: Under Kyndryl safety policy, drinking + self-drive is strictly prohibited.",
          "warning"
        );
      }

      const currentTravel = getSelectedRadioValue("travelMode");
      if (!currentTravel) {
        if (travelModeMsg) {
          travelModeMsg.textContent =
            "⚠️ Please select an approved travel mode (Kyndryl Shuttle Bus, Cab / Carpool, or Public Transport).";
          travelModeMsg.className = "field-msg msg-error";
        }
        safetyWarningBanner.classList.add("hidden");
        btnSubmitRegistration.disabled = false;
        return false;
      } else if (currentTravel === "Self Drive") {
        safetyWarningBanner.classList.remove("hidden");
        btnSubmitRegistration.disabled = true;
        btnSubmitRegistration.title = "Drinking + Self Drive is strictly prohibited";
        return false;
      } else {
        if (travelModeMsg) {
          travelModeMsg.textContent = "✓ Approved safe travel mode selected.";
          travelModeMsg.className = "field-msg msg-success";
        }
        safetyWarningBanner.classList.add("hidden");
        btnSubmitRegistration.disabled = false;
        btnSubmitRegistration.title = "";
      }
    } else {
      // Not drinking
      if (travelRequiredStar) travelRequiredStar.classList.add("hidden");
      if (travelStatusBadge) {
        travelStatusBadge.textContent = "Optional if not drinking";
        travelStatusBadge.className = "travel-status-badge badge-optional";
      }
      if (travelHintText) {
        travelHintText.textContent =
          "Choose your preferred transit mode (optional if not drinking).";
      }

      // Enable Self-Drive
      if (travelSelfDrive) travelSelfDrive.disabled = false;
      if (selfDriveCardWrapper) selfDriveCardWrapper.classList.remove("disabled-option");
      if (selfDriveProhibitedBadge) selfDriveProhibitedBadge.classList.add("hidden");

      if (travelModeMsg) {
        travelModeMsg.textContent = "";
        travelModeMsg.className = "field-msg";
      }
      safetyWarningBanner.classList.add("hidden");
      btnSubmitRegistration.disabled = false;
      btnSubmitRegistration.title = "";
    }

    return true;
  }

  // Intercept click on disabled self-drive option
  if (selfDriveCardWrapper) {
    selfDriveCardWrapper.addEventListener("click", (e) => {
      const alcoholPref = getSelectedRadioValue("alcoholPref");
      if (alcoholPref === "Yes") {
        e.preventDefault();
        showToast(
          "Safety Policy: Drinking + Self Drive is strictly prohibited. Please choose Shuttle Bus, Cab, or Public Transport.",
          "error"
        );
        safetyWarningBanner.classList.remove("hidden");
      }
    });
  }

  // Checkbox listeners for real-time validation feedback
  if (confirmAttendance) {
    confirmAttendance.addEventListener("change", () => {
      if (confirmAttendance.checked && confirmAttendanceMsg) {
        confirmAttendanceMsg.textContent = "";
      }
    });
  }
  if (acceptTerms) {
    acceptTerms.addEventListener("change", () => {
      if (acceptTerms.checked && acceptTermsMsg) {
        acceptTermsMsg.textContent = "";
      }
    });
  }

  // Bind change events to all radio buttons
  document
    .querySelectorAll('input[name="alcoholPref"], input[name="travelMode"]')
    .forEach((radio) => {
      radio.addEventListener("change", checkSafetyPolicyRule);
    });

  // Initial safety check on load
  checkSafetyPolicyRule();

  // =========================================================================
  // EMPLOYEE REGISTRATION FORM SUBMISSION
  // =========================================================================
  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formAlertBox.classList.add("hidden");
    formAlertBox.textContent = "";

    const fullName = fullNameInput.value.trim();
    const email = officialEmailInput.value.trim().toLowerCase();
    const mobileNumber = mobileNumberInput.value.trim();
    const emergencyContact = emergencyContactInput.value.trim();
    const dietaryPref = getSelectedRadioValue("dietaryPref");
    const alcoholPref = getSelectedRadioValue("alcoholPref");
    const travelMode = getSelectedRadioValue("travelMode");

    // Requirement Check 1: Collect Name
    if (!fullName) {
      showFormError("Please enter your Full Name.");
      fullNameInput.focus();
      return;
    }

    // Requirement Check 2: Only @kyndryl.com email addresses are eligible
    if (!validateEmailDomain(email)) {
      showFormError(
        "Access Restricted: Only official @kyndryl.com email addresses are eligible."
      );
      officialEmailInput.focus();
      return;
    }

    // Requirement Check 3: Mobile Number
    if (!mobileNumber) {
      showFormError("Please provide your contact Mobile Number.");
      mobileNumberInput.focus();
      return;
    }

    // Requirement Check 4: Emergency Contact Details
    if (!emergencyContact) {
      showFormError(
        "Please provide Emergency Contact details (name and phone number)."
      );
      emergencyContactInput.focus();
      return;
    }

    // Requirement Check 5: Dietary Preference
    if (!dietaryPref) {
      showFormError("Please select your Dietary Preference.");
      return;
    }

    // Requirement Check 6: Alcohol Preference
    if (!alcoholPref) {
      showFormError("Please select your Alcohol Preference.");
      return;
    }

    // Requirement Check 7: Attendance Confirmation
    if (!confirmAttendance || !confirmAttendance.checked) {
      showFormError(
        "Mandatory check: Employees must confirm their attendance to register."
      );
      if (confirmAttendanceMsg) {
        confirmAttendanceMsg.textContent =
          "✗ Please check this box to confirm your in-person attendance.";
        confirmAttendanceMsg.className = "field-msg msg-error";
      }
      if (confirmAttendance) confirmAttendance.focus();
      return;
    }

    // Requirement Check 8: Accept Event Terms and Conditions
    if (!acceptTerms || !acceptTerms.checked) {
      showFormError(
        "Mandatory check: Employees must accept the event terms and conditions to register."
      );
      if (acceptTermsMsg) {
        acceptTermsMsg.textContent =
          "✗ Please accept the event terms and conditions to proceed.";
        acceptTermsMsg.className = "field-msg msg-error";
      }
      if (acceptTerms) acceptTerms.focus();
      return;
    }

    // Requirement Check 9: Mode of travel when drinking
    if (alcoholPref === "Yes") {
      if (!travelMode) {
        showFormError(
          "Mandatory check: If an employee indicates that they will be drinking, they must select their mode of travel."
        );
        if (travelModeMsg) {
          travelModeMsg.textContent =
            "✗ Mode of travel is required when consuming alcohol.";
          travelModeMsg.className = "field-msg msg-error";
        }
        if (travelModeSection) {
          travelModeSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Requirement Check 10: Drinking + Self Drive must be prohibited
      if (travelMode === "Self Drive") {
        showFormError(
          "Safety Policy Violation: Drinking + Self Drive is prohibited. Employees consuming alcohol must choose Kyndryl Shuttle Bus, Cab / Carpool, or Public Transport."
        );
        safetyWarningBanner.classList.remove("hidden");
        return;
      }
    }

    // Submit payload to server
    setSubmitLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          mobile_number: mobileNumber,
          emergency_contact: emergencyContact,
          dietary_pref: dietaryPref,
          alcohol_pref: alcoholPref,
          travel_mode: travelMode || "Not Specified",
          confirmed_attendance: true,
          accepted_terms: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed. Please check details.");
      }

      // Success!
      showToast("Registration successful! Your digital pass is ready.", "success");
      registrationForm.reset();
      officialEmailInput.classList.remove("valid-field", "invalid-field");
      emailMsg.textContent = "Domain validation: must end with @kyndryl.com";
      emailMsg.className = "field-msg";
      if (confirmAttendanceMsg) confirmAttendanceMsg.textContent = "";
      if (acceptTermsMsg) acceptTermsMsg.textContent = "";
      checkSafetyPolicyRule();

      // Open digital pass modal
      openPassModal(result.data);

      // Refresh admin data
      fetchStats();
    } catch (err) {
      showFormError(err.message);
      showToast(err.message, "error");
    } finally {
      setSubmitLoading(false);
    }
  });

  function showFormError(msg) {
    formAlertBox.className = "alert-box alert-error";
    formAlertBox.textContent = msg;
    formAlertBox.classList.remove("hidden");
    formAlertBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function setSubmitLoading(isLoading) {
    const btnText = btnSubmitRegistration.querySelector(".btn-text");
    const spinner = btnSubmitRegistration.querySelector(".btn-spinner");

    if (isLoading) {
      btnSubmitRegistration.disabled = true;
      btnText.textContent = "Securing Registration...";
      spinner.classList.remove("hidden");
    } else {
      btnSubmitRegistration.disabled = false;
      btnText.textContent = "Confirm Registration & Generate Pass";
      spinner.classList.add("hidden");
      checkSafetyPolicyRule();
    }
  }

  // =========================================================================
  // DIGITAL PASS / TICKET MODAL & QR CODE GENERATOR
  // =========================================================================
  function openPassModal(record) {
    state.selectedRecordForModal = record;

    modalTicketCode.textContent = record.ticket_code;
    if (eligibilityTicketCode) eligibilityTicketCode.textContent = record.ticket_code;
    modalAvatar.textContent = (record.full_name || "K").charAt(0).toUpperCase();
    modalName.textContent = record.full_name;
    modalEmail.textContent = record.email;
    if (modalConfirmedEmail) modalConfirmedEmail.textContent = record.email;
    modalMobile.textContent = record.mobile_number;
    modalEmergency.textContent = record.emergency_contact;
    modalDiet.textContent = record.dietary_pref;
    modalAlcohol.textContent =
      record.alcohol_pref === "Yes"
        ? "Yes (Cocktails & Drinks)"
        : "No (Soft Beverages)";
    if (modalConfirmedAttendance) {
      modalConfirmedAttendance.textContent = "✓ Confirmed (In-Person)";
    }
    if (modalAcceptedTerms) {
      modalAcceptedTerms.textContent = "✓ Accepted & Compliant";
    }
    modalTravel.textContent = record.travel_mode;

    if (record.attendance_status === 1) {
      modalAttendanceBadge.textContent = `✓ Checked In (${record.attended_at || "Attended"})`;
      modalAttendanceBadge.className = "status-badge badge-attended";
    } else {
      modalAttendanceBadge.textContent = "Pending Arrival";
      modalAttendanceBadge.className = "status-badge badge-pending";
    }

    // Draw customized QR code representation on HTML5 Canvas
    drawPassQrCode(record.ticket_code, record.email);

    passModal.classList.remove("hidden");
  }

  function closePassModal() {
    passModal.classList.add("hidden");
    state.selectedRecordForModal = null;
  }

  btnCloseModal.addEventListener("click", closePassModal);
  passModal.addEventListener("click", (e) => {
    if (e.target === passModal) closePassModal();
  });

  btnPrintTicket.addEventListener("click", () => {
    window.print();
  });

  // =========================================================================
  // EMAIL CONFIRMATION PREVIEW HANDLERS
  // =========================================================================
  if (btnViewSentEmail) {
    btnViewSentEmail.addEventListener("click", async () => {
      if (!state.selectedRecordForModal) return;
      const ticket = state.selectedRecordForModal.ticket_code;
      const email = state.selectedRecordForModal.email;
      await openEmailPreview(ticket, email);
    });
  }

  async function openEmailPreview(ticket, email) {
    try {
      const res = await fetch(
        `/api/registration/email?ticket_code=${encodeURIComponent(ticket)}&email=${encodeURIComponent(email)}`
      );
      const json = await res.json();
      if (!res.ok || !json.data) {
        throw new Error(json.error || "Could not retrieve email confirmation.");
      }

      const emailData = json.data;
      if (emailPreviewSubject) emailPreviewSubject.textContent = emailData.subject;
      if (emailPreviewTo) emailPreviewTo.textContent = emailData.recipient_email;
      if (emailPreviewDate)
        emailPreviewDate.textContent = new Date(emailData.sent_at).toLocaleString();
      if (emailPreviewContent) emailPreviewContent.innerHTML = emailData.body_html;

      emailPreviewModal.classList.remove("hidden");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  if (btnCloseEmailModal) {
    btnCloseEmailModal.addEventListener("click", () => {
      emailPreviewModal.classList.add("hidden");
    });
  }
  if (btnCloseEmailModalBtn) {
    btnCloseEmailModalBtn.addEventListener("click", () => {
      emailPreviewModal.classList.add("hidden");
    });
  }
  if (emailPreviewModal) {
    emailPreviewModal.addEventListener("click", (e) => {
      if (e.target === emailPreviewModal) emailPreviewModal.classList.add("hidden");
    });
  }

  /**
   * Deterministic visual QR Code Matrix Renderer for canvas
   */
  function drawPassQrCode(ticketCode, email) {
    const ctx = ticketQrCanvas.getContext("2d");
    const size = ticketQrCanvas.width;
    ctx.clearRect(0, 0, size, size);

    // Canvas background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, size, size);

    const gridSize = 21;
    const cellSize = Math.floor(size / gridSize);
    const offset = Math.floor((size - gridSize * cellSize) / 2);

    // Deterministic pseudo-random seed based on ticketCode + email
    let seed = 0;
    const combinedStr = ticketCode + "|" + email;
    for (let i = 0; i < combinedStr.length; i++) {
      seed = (seed * 31 + combinedStr.charCodeAt(i)) & 0xffffffff;
    }

    function pseudoRandom() {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 4294967296;
    }

    ctx.fillStyle = "#12151B";

    // Draw standard 3 Corner Position Markers (Finder Patterns)
    function drawFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = (r === 0 || r === 6 || c === 0 || c === 6);
          const isCenter = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          if (isBorder || isCenter) {
            ctx.fillRect(
              offset + (c0 + c) * cellSize,
              offset + (r0 + r) * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    // Fill data cells
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner finder zones
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= gridSize - 8;
        const inBottomLeft = r >= gridSize - 8 && c < 8;

        if (!inTopLeft && !inTopRight && !inBottomLeft) {
          // Timing pattern or pseudo-random data cell
          if (r === 6 || c === 6) {
            if ((r + c) % 2 === 0) {
              ctx.fillRect(
                offset + c * cellSize,
                offset + r * cellSize,
                cellSize,
                cellSize
              );
            }
          } else if (pseudoRandom() > 0.45) {
            ctx.fillRect(
              offset + c * cellSize,
              offset + r * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }
    }
  }

  // =========================================================================
  // ADMIN DASHBOARD & ATTENDANCE MANAGEMENT
  // =========================================================================
  async function loadAdminData() {
    if (!state.adminToken) return;
    await Promise.all([fetchStats(), fetchRegistrations()]);
  }

  async function fetchStats() {
    if (!state.adminToken) return;
    try {
      const res = await fetch("/api/stats", {
        headers: { "X-Admin-Token": state.adminToken },
      });
      if (res.status === 401) {
        state.adminToken = null;
        sessionStorage.removeItem("kyndryl_admin_token");
        updateAdminViewState();
        showToast("Administrative session expired. Please authenticate.", "warning");
        return;
      }
      const json = await res.json();
      if (json.success) {
        state.stats = json.stats;
        renderStats(json.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  function renderStats(s) {
    statTotalRegistrations.textContent = s.total_registered;
    statTotalAttended.textContent = s.total_attended;
    statAttendancePercent.textContent = `${s.attendance_rate}% attendance rate`;
    statRemaining.textContent = s.remaining;
    if (statEmailsSent) {
      statEmailsSent.textContent = s.total_emails_sent || s.total_registered;
    }

    // Header counter badge
    badgeAttendanceCounter.textContent = `${s.total_attended} / ${s.total_registered}`;

    // Dietary Progress Bars
    const dietaryKeys = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"];
    const dietColors = {
      Vegetarian: "#10B981",
      "Non-Vegetarian": "#EC4029",
      Vegan: "#059669",
      Jain: "#D97706",
    };

    dietaryStatsList.innerHTML = dietaryKeys
      .map((k) => {
        const count = s.by_dietary[k] || 0;
        const pct =
          s.total_registered > 0
            ? Math.round((count / s.total_registered) * 100)
            : 0;
        const color = dietColors[k] || "#6366F1";
        return `
        <div class="bar-row">
          <div class="bar-row-info">
            <span>${k}</span>
            <span><strong>${count}</strong> (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
      })
      .join("");

    // Alcohol compact bars
    const alcYes = s.by_alcohol["Yes"] || 0;
    const alcNo = s.by_alcohol["No"] || 0;
    const alcTotal = alcYes + alcNo;
    const alcYesPct = alcTotal > 0 ? Math.round((alcYes / alcTotal) * 100) : 0;
    const alcNoPct = alcTotal > 0 ? Math.round((alcNo / alcTotal) * 100) : 0;

    alcoholStatsList.innerHTML = `
      <div class="bar-row">
        <div class="bar-row-info">
          <span>Consuming Alcohol</span>
          <span>${alcYes} (${alcYesPct}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${alcYesPct}%; background-color: #EC4029;"></div>
        </div>
      </div>
      <div class="bar-row">
        <div class="bar-row-info">
          <span>No Alcohol (Soft)</span>
          <span>${alcNo} (${alcNoPct}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${alcNoPct}%; background-color: #64748B;"></div>
        </div>
      </div>
    `;

    // Travel Modes
    const travelModes = [
      "Kyndryl Shuttle Bus",
      "Cab / Carpool",
      "Public Transport",
      "Self Drive",
    ];
    const travelColors = {
      "Kyndryl Shuttle Bus": "#2563EB",
      "Cab / Carpool": "#7C3AED",
      "Public Transport": "#0D9488",
      "Self Drive": "#D97706",
    };

    travelStatsList.innerHTML = travelModes
      .map((t) => {
        const count = s.by_travel[t] || 0;
        const pct =
          s.total_registered > 0
            ? Math.round((count / s.total_registered) * 100)
            : 0;
        return `
        <div class="bar-row">
          <div class="bar-row-info">
            <span>${t}</span>
            <span>${count}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background-color: ${travelColors[t] || "#6366F1"};"></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  async function fetchRegistrations() {
    if (!state.adminToken) return;
    const params = new URLSearchParams();
    if (filterSearch && filterSearch.value.trim())
      params.append("search", filterSearch.value.trim());
    if (filterName && filterName.value.trim())
      params.append("name", filterName.value.trim());
    if (filterEmail && filterEmail.value.trim())
      params.append("email", filterEmail.value.trim());
    if (filterAttendance && filterAttendance.value !== "All")
      params.append("attendance", filterAttendance.value);
    if (filterDietary && filterDietary.value !== "All")
      params.append("dietary", filterDietary.value);
    if (filterAlcohol && filterAlcohol.value !== "All")
      params.append("alcohol", filterAlcohol.value);
    if (filterTravel && filterTravel.value !== "All")
      params.append("travel", filterTravel.value);

    try {
      const res = await fetch(`/api/registrations?${params.toString()}`, {
        headers: { "X-Admin-Token": state.adminToken },
      });
      if (res.status === 401) {
        state.adminToken = null;
        sessionStorage.removeItem("kyndryl_admin_token");
        updateAdminViewState();
        showToast("Administrative session required.", "warning");
        return;
      }
      const json = await res.json();
      if (json.success) {
        state.registrations = json.data;
        renderRegistrationsTable(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    }
  }

  function renderRegistrationsTable(records) {
    rosterCountText.textContent = `Showing ${records.length} registrations`;

    if (!records || records.length === 0) {
      rosterTableBody.innerHTML = "";
      rosterEmptyState.classList.remove("hidden");
      return;
    }

    rosterEmptyState.classList.add("hidden");

    rosterTableBody.innerHTML = records
      .map((r) => {
        const isAttended = r.attendance_status === 1;

        // Dietary badge class
        const dietBadgeClass =
          {
            Vegetarian: "badge-veg",
            "Non-Vegetarian": "badge-nonveg",
            Vegan: "badge-vegan",
            Jain: "badge-jain",
          }[r.dietary_pref] || "badge-veg";

        // Travel badge class
        const travelBadgeClass =
          {
            "Kyndryl Shuttle Bus": "badge-bus",
            "Cab / Carpool": "badge-cab",
            "Public Transport": "badge-public",
            "Self Drive": "badge-selfdrive",
          }[r.travel_mode] || "badge-bus";

        return `
        <tr data-id="${r.id}">
          <td>
            <span class="ticket-pill" role="button" title="Click to view pass" onclick="window.viewPassById(${r.id})">
              ${r.ticket_code}
            </span>
          </td>
          <td>
            <div class="user-cell">
              <strong>${escapeHtml(r.full_name)}</strong>
              <small>${escapeHtml(r.email)}</small>
            </div>
          </td>
          <td>
            <div class="contact-cell">
              <div>📞 ${escapeHtml(r.mobile_number)}</div>
              <small>🚨 ${escapeHtml(r.emergency_contact)}</small>
            </div>
          </td>
          <td>
            <span class="badge ${dietBadgeClass}">${escapeHtml(r.dietary_pref)}</span>
          </td>
          <td>
            <span class="badge ${r.alcohol_pref === "Yes" ? "badge-alcohol-yes" : "badge-alcohol-no"}">
              ${r.alcohol_pref === "Yes" ? "🍷 Alcohol (Yes)" : "🥤 No Alcohol"}
            </span>
          </td>
          <td>
            <span class="badge ${travelBadgeClass}">${escapeHtml(r.travel_mode)}</span>
          </td>
          <td>
            ${
              isAttended
                ? `
              <span class="status-badge badge-attended">
                <span>✓ Attended</span>
              </span>
              <span class="time-stamp">Checked in: ${escapeHtml(r.attended_at || "Recorded")}</span>
              <span class="method-tag">${escapeHtml(r.verification_method || "PRIMARY_PASS")}</span>
            `
                : `
              <span class="status-badge badge-pending">
                <span>Pending</span>
              </span>
            `
            }
          </td>
          <td>
            <div class="row-actions">
              ${
                !isAttended
                  ? `
                <button class="btn btn-success btn-sm" onclick="window.markAttendanceById(${r.id})">
                  ✓ Mark
                </button>
              `
                  : `
                <button class="btn btn-outline btn-sm" title="Undo check-in if marked accidentally" onclick="window.unmarkAttendanceById(${r.id})">
                  ↩ Undo
                </button>
              `
              }
              <button class="btn btn-outline btn-sm" onclick="window.viewDetailsById(${r.id})" title="View Complete Attendee Dossier">
                👁️ Details
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  // =========================================================================
  // ATTENDANCE MARKING & DUPLICATE PREVENTION LOGIC
  // =========================================================================

  // Expose global handler for row action buttons
  window.markAttendanceById = async function (id) {
    if (!state.adminToken) return;
    try {
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": state.adminToken,
        },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();

      if (res.status === 409) {
        showToast(json.message, "warning");
        return;
      }

      if (!res.ok) {
        showToast(json.error || "Failed to mark attendance", "error");
        return;
      }

      showToast(json.message, "success");
      await loadAdminData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  window.unmarkAttendanceById = async function (id) {
    if (!state.adminToken) return;
    try {
      const res = await fetch("/api/attendance/unmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": state.adminToken,
        },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      showToast(json.message || "Attendance reset", "info");
      await loadAdminData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  window.viewPassById = function (id) {
    const record = state.registrations.find((r) => r.id === id);
    if (record) {
      openPassModal(record);
    }
  };

  window.viewDetailsById = function (id) {
    const record = state.registrations.find((r) => r.id === id);
    if (!record) return;
    selectedAttendeeDetailId = id;

    if (detailAvatar)
      detailAvatar.textContent = (record.full_name || "K").charAt(0).toUpperCase();
    if (detailFullName) detailFullName.textContent = record.full_name;
    if (detailEmail) detailEmail.textContent = record.email;
    if (detailTicketCode) detailTicketCode.textContent = record.ticket_code;
    if (detailMobile) detailMobile.textContent = record.mobile_number;
    if (detailEmergency) detailEmergency.textContent = record.emergency_contact;
    if (detailDiet) detailDiet.textContent = record.dietary_pref;
    if (detailAlcohol)
      detailAlcohol.textContent =
        record.alcohol_pref === "Yes"
          ? "Consuming Alcohol (21+)"
          : "No Alcohol (Soft Beverages)";
    if (detailTravel) detailTravel.textContent = record.travel_mode;
    if (detailAttendanceStatus) {
      detailAttendanceStatus.textContent =
        record.attendance_status === 1
          ? `✓ Checked In (${record.attended_at || "Present"})`
          : "Not Checked In (Pending Arrival)";
    }
    if (detailVerificationMethod) {
      detailVerificationMethod.textContent =
        record.attendance_status === 1
          ? (record.verification_method || "PRIMARY_PASS")
          : "N/A (Not yet checked in)";
    }
    if (detailVerificationNotes) {
      detailVerificationNotes.textContent =
        record.verification_notes || (record.attendance_status === 1 ? "Standard primary pass verification" : "None");
    }
    if (btnToggleAttendanceInModal) {
      btnToggleAttendanceInModal.textContent =
        record.attendance_status === 1 ? "Undo Check-In" : "Mark Present";
    }

    attendeeDetailsModal.classList.remove("hidden");
  };

  if (btnCloseAttendeeDetails) {
    btnCloseAttendeeDetails.addEventListener("click", () =>
      attendeeDetailsModal.classList.add("hidden")
    );
  }
  if (btnCloseAttendeeDetailsBtn) {
    btnCloseAttendeeDetailsBtn.addEventListener("click", () =>
      attendeeDetailsModal.classList.add("hidden")
    );
  }
  if (attendeeDetailsModal) {
    attendeeDetailsModal.addEventListener("click", (e) => {
      if (e.target === attendeeDetailsModal)
        attendeeDetailsModal.classList.add("hidden");
    });
  }

  if (btnToggleAttendanceInModal) {
    btnToggleAttendanceInModal.addEventListener("click", async () => {
      if (!selectedAttendeeDetailId) return;
      const rec = state.registrations.find(
        (r) => r.id === selectedAttendeeDetailId
      );
      if (!rec) return;
      if (rec.attendance_status === 1) {
        await window.unmarkAttendanceById(selectedAttendeeDetailId);
      } else {
        await window.markAttendanceById(selectedAttendeeDetailId);
      }
      attendeeDetailsModal.classList.add("hidden");
    });
  }

  // =========================================================================
  // ENTRANCE ATTENDANCE MANAGEMENT & ELIGIBILITY VERIFICATION (REQUIREMENT 3)
  // =========================================================================

  // =========================================================================
  // ENTRANCE ATTENDANCE MANAGEMENT & ELIGIBILITY VERIFICATION (SIMPLIFIED)
  // =========================================================================

  // Render Clean & Easy Entrance Eligibility Card
  function renderEligibilityCard(record, elig) {
    if (!entranceEligibilityCard) return;
    if (!record || !elig) {
      entranceEligibilityCard.classList.add("hidden");
      return;
    }

    const isAttended = Boolean(elig.already_attended || record.attendance_status === 1);
    const attendedTime = elig.attended_at || record.attended_at || "Earlier";
    const methodUsed = elig.verification_method || record.verification_method || "PRIMARY_PASS";

    const wristbandHtml = elig.requires_age_check
      ? `<span class="wristband-pill-red">🔴 RED WRISTBAND (21+ Bar Access)</span>`
      : `<span class="wristband-pill-green">🟢 GREEN WRISTBAND (Soft Drinks Only)</span>`;

    const statusBannerHtml = isAttended
      ? `
      <div class="duplicate-alert-banner">
        ⚠️ <strong>Already Admitted:</strong> Checked in on <strong>${escapeHtml(attendedTime)}</strong> via <strong>${escapeHtml(methodUsed)}</strong>.
      </div>
    `
      : `
      <div style="background: #ECFDF5; border: 1.5px solid #10B981; border-radius: 8px; padding: 0.75rem 1rem; color: #065F46; margin-bottom: 0.85rem; font-size: 0.88rem;">
        ✓ <strong>Attendee Verified & Eligible:</strong> Ready for gate admission and badge issuance.
      </div>
    `;

    const actionButtonHtml = !isAttended
      ? `
      <button class="btn btn-primary" onclick="window.confirmAttendanceFromCard('${record.ticket_code}')">
        ✓ Confirm & Admit Attendee
      </button>
    `
      : `
      <button class="btn btn-outline btn-sm" onclick="window.unmarkAttendanceById(${record.id})">
        ↩ Undo Check-In
      </button>
    `;

    entranceEligibilityCard.innerHTML = `
      ${statusBannerHtml}
      <div class="eligibility-card-header">
        <div class="eligibility-user-meta">
          <h4>${escapeHtml(record.full_name)}</h4>
          <p>${escapeHtml(record.email)} • 📞 ${escapeHtml(record.mobile_number)}</p>
        </div>
        <span class="ticket-pill" style="font-size: 0.85rem; padding: 4px 10px;">${escapeHtml(record.ticket_code)}</span>
      </div>

      <!-- 3 Simple Visual Verification Badges -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin: 1rem 0;">
        <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 6px; padding: 10px 12px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #065F46; text-transform: uppercase;">1. Entry Eligibility</div>
          <div style="font-size: 0.92rem; font-weight: 800; color: #047857; margin-top: 3px;">✅ Verified Kyndryl Employee</div>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 10px 12px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #64748B; text-transform: uppercase;">2. Meal Counter</div>
          <div style="font-size: 0.92rem; font-weight: 800; color: #0F141C; margin-top: 3px;">🍽️ ${escapeHtml(record.dietary_pref)}</div>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 10px 12px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #64748B; text-transform: uppercase;">3. Bar Wristband to Issue</div>
          <div style="margin-top: 4px;">${wristbandHtml}</div>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 0.85rem;">
        <span style="font-size: 0.82rem; color: #64748B;">🚗 Transit: <strong>${escapeHtml(record.travel_mode)}</strong></span>
        <div style="display: flex; gap: 0.5rem;">
          ${actionButtonHtml}
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('entranceEligibilityCard').classList.add('hidden')">
            Close
          </button>
        </div>
      </div>
    `;

    entranceEligibilityCard.classList.remove("hidden");
    entranceEligibilityCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Core Attendance Check-in API Helper
  async function performEntranceCheckin(payload) {
    if (!state.adminToken) {
      showToast("Administrator credentials required.", "error");
      return;
    }

    try {
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": state.adminToken,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.status === 409) {
        // Duplicate check-in identified
        checkinResultAlert.className = "checkin-result-alert checkin-duplicate";
        checkinResultAlert.innerHTML = `
          ⚠️ <strong>Already Checked In:</strong> ${escapeHtml(json.message)}<br>
          <small>Previously recorded at ${escapeHtml(json.previous_checkin ? json.previous_checkin.attended_at : "venue")}. Duplicate admittance blocked.</small>
        `;
        checkinResultAlert.classList.remove("hidden");
        showToast(json.message, "warning");
        if (json.data && json.eligibility) {
          renderEligibilityCard(json.data, json.eligibility);
        }
        return;
      }

      if (res.status === 404) {
        // Invalid entry credentials identified
        checkinResultAlert.className = "checkin-result-alert checkin-error";
        checkinResultAlert.innerHTML = `
          ❌ <strong>No Attendee Found:</strong> ${escapeHtml(json.error || "Attendee not found")}<br>
          <small>Please check for typos in the Pass ID, official email, or mobile number.</small>
        `;
        checkinResultAlert.classList.remove("hidden");
        if (entranceEligibilityCard) entranceEligibilityCard.classList.add("hidden");
        showToast("Attendee not found.", "error");
        return;
      }

      if (!res.ok) {
        checkinResultAlert.className = "checkin-result-alert checkin-error";
        checkinResultAlert.innerHTML = `❌ <strong>Error:</strong> ${escapeHtml(json.error || "Failed to mark attendance")}`;
        checkinResultAlert.classList.remove("hidden");
        showToast(json.error || "Check-in failed", "error");
        return;
      }

      // Success
      checkinResultAlert.className = "checkin-result-alert checkin-success";
      checkinResultAlert.innerHTML = `
        ✅ <strong>Attendee Admitted:</strong> ${escapeHtml(json.message)}<br>
        <small>Timestamp Recorded: <strong>${escapeHtml(json.timestamp || "Now")}</strong> • Method: <strong>${escapeHtml(json.verification_method || "PRIMARY_PASS")}</strong></small>
      `;
      checkinResultAlert.classList.remove("hidden");
      showToast(json.message, "success");

      if (quickCheckinInput) quickCheckinInput.value = "";

      if (json.data && json.eligibility) {
        renderEligibilityCard(json.data, json.eligibility);
      }
      await loadAdminData();
    } catch (err) {
      checkinResultAlert.className = "checkin-result-alert checkin-error";
      checkinResultAlert.textContent = err.message;
      checkinResultAlert.classList.remove("hidden");
    }
  }

  // Global helper for card check-in confirmation
  window.confirmAttendanceFromCard = async function (ticketCode) {
    const isBadgeChecked = altBadgeConfirmed && altBadgeConfirmed.checked;
    await performEntranceCheckin({
      ticket_code: ticketCode,
      verification_method: isBadgeChecked ? "ALTERNATIVE_BADGE_OVERRIDE" : "PRIMARY_PASS",
      verification_notes: isBadgeChecked ? "Physical Kyndryl Employee Badge verified in person" : "",
    });
  };

  // Global helper for table row eligibility inspection
  window.verifyEligibilityFromTable = async function (id) {
    const rec = state.registrations.find((r) => r.id === id);
    if (rec) {
      renderEligibilityCard(rec, {
        is_eligible: true,
        already_attended: rec.attendance_status === 1,
        attended_at: rec.attended_at,
        verification_method: rec.verification_method,
        requires_age_check: rec.alcohol_pref === "Yes",
      });
    }
  };

  // Universal Single Fast Check-in Handler
  if (quickCheckinForm) {
    quickCheckinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = quickCheckinInput ? quickCheckinInput.value.trim() : "";
      if (!query) {
        showToast("Please scan or enter a Pass ID, Email, Phone, or Name.", "warning");
        return;
      }

      const isBadgeChecked = altBadgeConfirmed && altBadgeConfirmed.checked;
      const payload = {
        verification_method: isBadgeChecked ? "ALTERNATIVE_BADGE_OVERRIDE" : "PRIMARY_PASS",
        verification_notes: isBadgeChecked ? "Physical Kyndryl Corporate RFID Badge verified in person at entrance" : "",
      };

      if (query.toUpperCase().startsWith("KYN-")) {
        payload.ticket_code = query.toUpperCase();
      } else if (query.includes("@")) {
        payload.email = query.toLowerCase();
      } else if (/^\+?[\d\s-]{8,}$/.test(query)) {
        payload.mobile_number = query;
      } else {
        payload.name = query;
      }

      await performEntranceCheckin(payload);
    });
  }

  // Filter event listeners (Search, Name, Email, Attendance, Dietary, Alcohol, Travel)
  function onFilterChanged() {
    clearTimeout(state.searchDebounceTimer);
    state.searchDebounceTimer = setTimeout(() => {
      fetchRegistrations();
    }, 200);
  }

  if (filterSearch) filterSearch.addEventListener("input", onFilterChanged);
  if (filterName) filterName.addEventListener("input", onFilterChanged);
  if (filterEmail) filterEmail.addEventListener("input", onFilterChanged);
  if (filterAttendance) filterAttendance.addEventListener("change", onFilterChanged);
  if (filterDietary) filterDietary.addEventListener("change", onFilterChanged);
  if (filterAlcohol) filterAlcohol.addEventListener("change", onFilterChanged);
  if (filterTravel) filterTravel.addEventListener("change", onFilterChanged);

  btnResetFilters.addEventListener("click", () => {
    if (filterSearch) filterSearch.value = "";
    if (filterName) filterName.value = "";
    if (filterEmail) filterEmail.value = "";
    if (filterAttendance) filterAttendance.value = "All";
    if (filterDietary) filterDietary.value = "All";
    if (filterAlcohol) filterAlcohol.value = "All";
    if (filterTravel) filterTravel.value = "All";
    fetchRegistrations();
  });

  // Export to CSV with admin token
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!state.adminToken) {
        showToast("Administrator credentials required to export CSV.", "error");
        return;
      }
      try {
        const res = await fetch(
          `/api/export?admin_token=${encodeURIComponent(state.adminToken)}`,
          {
            headers: { "X-Admin-Token": state.adminToken },
          }
        );
        if (!res.ok) {
          throw new Error("Export failed: Unauthorized or server error.");
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kyndryl_celebrations_2026_registrations.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast("CSV export downloaded successfully.", "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // Clear all data button (Reset to 0 records)
  const btnClearData = document.getElementById("btnClearData");
  if (btnClearData) {
    btnClearData.addEventListener("click", async () => {
      if (!state.adminToken) return;
      if (
        !confirm(
          "Are you sure you want to delete ALL registration and attendance records? This will clear the database to 0 records so you can register real employees from scratch."
        )
      ) {
        return;
      }
      try {
        const res = await fetch("/api/admin/clear", {
          method: "POST",
          headers: { "X-Admin-Token": state.adminToken },
        });
        const json = await res.json();
        showToast(json.message || "All records cleared", "info");
        await loadAdminData();
      } catch (err) {
        showToast("Clear failed: " + err.message, "error");
      }
    });
  }

  btnRefreshStats.addEventListener("click", () => {
    loadAdminData();
    showToast("Dashboard refreshed", "info");
  });

  // =========================================================================
  // TOAST NOTIFICATIONS & UTILITIES
  // =========================================================================
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon =
      type === "success"
        ? "✓"
        : type === "warning"
        ? "⚠️"
        : type === "error"
        ? "✕"
        : "ℹ️";
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // If already logged in from previous session, update view state
  updateAdminViewState();
  if (state.adminToken) {
    loadAdminData();
  }
});
