const BUILTIN_RULES = {
  metadata: {
    region: "JP",
    locale: "Kanagawa/Yamato",
    version: "2025-09-28",
    currency: "JPY"
  },
  defaults: {
    multiple_birth: true,
    gestation_days: 280,
    father_leave_days: 365,
    father_leave_start_offset_days: 1
  },
  contacts: {
    health_insurance: {
      type: "健康保険組合",
      name: "協会けんぽ神奈川支部",
      address: "〒220-8538 神奈川県横浜市西区みなとみらい3-6-1",
      phone: "0570-004-401",
      preferred_method: "郵送"
    },
    hello_work: {
      type: "ハローワーク",
      name: "ハローワーク大和",
      address: "神奈川県大和市深見西3-3-21",
      phone: "046-260-8609",
      preferred_method: "窓口"
    },
    city_office: {
      type: "自治体",
      name: "大和市 すくすく子育て課",
      address: "神奈川県大和市鶴間1-31-7",
      phone: "046-260-5608",
      preferred_method: "窓口"
    },
    hospital: {
      type: "医療機関",
      name: "北里大学病院 産科",
      address: "神奈川県相模原市南区北里1-15-1",
      phone: "042-778-8111",
      preferred_method: "窓口"
    }
  },
  documents: {
    sickness_allowance: ["傷病手当金支給申請書", "医師意見書", "事業主証明"],
    maternity_allowance: ["出産手当金支給申請書", "事業主証明", "母子健康手帳"],
    childbirth_lump_sum: ["直接支払制度同意書", "健康保険証", "医療機関請求書"],
    childcare_leave: ["育児休業給付金支給申請書", "雇用保険被保険者証", "賃金台帳"],
    post_birth_support: ["出生後休業支援給付金申請書", "出生証明書", "雇用保険被保険者証"],
    child_allowance: ["児童手当認定請求書", "健康保険証", "口座確認書類"],
    child_medical: ["乳幼児医療費助成申請書", "健康保険証", "マイナンバーカード"]
  },
  urls: {
    sickness_allowance: "https://www.kyoukaikenpo.or.jp/~/media/Files/hoken/shikaku/kyufu/kyoukaikenpo/syobyo_shinsei.pdf",
    maternity_allowance: "https://www.kyoukaikenpo.or.jp/g3/cat320/sb3030/r150/",
    childbirth_lump_sum: "https://www.kyoukaikenpo.or.jp/g5/cat520/r161/",
    childcare_leave: "https://www.mhlw.go.jp/bunya/koyoukintou/ikuji_koyou/",
    post_birth_support: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000213009.html",
    child_allowance: "https://www.city.yamato.lg.jp/soshiki/kodomoseishonenbu/kosodateshienka/",
    child_medical: "https://www.city.yamato.lg.jp/soshiki/kenkofukushibu/iryo_fukushi/"
  },
  allowances: {
    sickness: {
      rate: 0.6667,
      waiting_days: 3,
      default_duration_days: 90,
      default_start: "2025-10-13",
      calculation_basis: "standard_daily = monthly_salary / 30"
    },
    maternity: {
      prenatal_days: 98,
      postnatal_days: 56,
      rate: 0.6667
    },
    childbirth_lump_sum: {
      amount_per_child: 500000,
      multiple_birth_multiplier: 2
    },
    childcare: {
      phase1_days: 180,
      phase1_rate: 0.67,
      phase2_rate: 0.5,
      payout_window_months: 2
    },
    post_birth_support: {
      duration_days: 28,
      extra_rate: 0.13,
      mother_window_weeks: 16,
      father_window_weeks: 8
    },
    child_allowance: {
      amount_per_child: 15000,
      payment_months: [6, 10, 2]
    },
    child_medical_subsidy: {
      copay: 0,
      note: "申請後は自己負担0円の前提"
    }
  },
  status_options: ["未着手", "準備中", "申請中", "差戻し", "決定", "入金済"],
  submission_methods: ["窓口", "郵送", "オンライン"],
  output_columns: [
    "年/月",
    "種別",
    "金額(円)",
    "制度カテゴリ",
    "対象者",
    "期間開始",
    "期間終了",
    "申請開始可能日",
    "申請期限",
    "提出先(種別)",
    "提出先(名称)",
    "提出方法",
    "必要書類",
    "支給率(%)",
    "対象日数",
    "支給単位(開始)",
    "支給単位(終了)",
    "振込予定日",
    "実入金日",
    "実入金額(円)",
    "ステータス",
    "差戻し理由",
    "問い合わせ先",
    "根拠URL"
  ]
};

const SAMPLE_INPUT = {
  wifeSalary: 420000,
  husbandSalary: 380000,
  dueDate: "2026-04-30",
  useSickLeave: true,
  motherLeaveEnd: null
};

const COLUMN_CONFIG = [
  { header: "年/月", key: "yearMonth" },
  { header: "種別", key: "type" },
  { header: "金額(円)", key: "amountDisplay" },
  { header: "制度カテゴリ", key: "schemeCategory" },
  { header: "対象者", key: "target" },
  { header: "期間開始", key: "periodStart" },
  { header: "期間終了", key: "periodEnd" },
  { header: "申請開始可能日", key: "applyStart" },
  { header: "申請期限", key: "applyDeadline" },
  { header: "提出先(種別)", key: "submitToType" },
  { header: "提出先(名称)", key: "submitToName" },
  { header: "提出方法", key: "submissionMethod" },
  { header: "必要書類", key: "documentsDisplay" },
  { header: "支給率(%)", key: "payoutRateDisplay" },
  { header: "対象日数", key: "targetDaysDisplay" },
  { header: "支給単位(開始)", key: "payoutUnitStart" },
  { header: "支給単位(終了)", key: "payoutUnitEnd" },
  { header: "振込予定日", key: "expectedDeposit" },
  { header: "実入金日", key: "actualDeposit" },
  { header: "実入金額(円)", key: "actualAmountDisplay" },
  { header: "ステータス", key: "status" },
  { header: "差戻し理由", key: "rejectionReason" },
  { header: "問い合わせ先", key: "contactDisplay" },
  { header: "根拠URL", key: "referenceUrl" }
];

const state = {
  rules: null,
  entries: [],
  summary: null,
  inputs: null,
  detailVisible: false
};

const refs = {};
const STORAGE_KEY = 'maternitySchedulerSession';

init();

async function init() {
  bindRefs();
  disableActions();
  bindEvents();
  state.rules = await loadRules();
  tryRestoreSession();
}

function bindRefs() {
  refs.form = document.getElementById("input-form");
  refs.summaryCards = document.getElementById("summary-cards");
  refs.scheduleContainer = document.getElementById("schedule-container");
  refs.exportCsvBtn = document.getElementById("export-csv");
  refs.exportIcsBtn = document.getElementById("export-ics");
  refs.saveSessionBtn = document.getElementById("save-session");
  refs.toggleDetailBtn = document.getElementById("toggle-detail");
  refs.loadSampleBtn = document.getElementById("load-sample");
  refs.clearStorageBtn = document.getElementById("clear-storage");
}

function bindEvents() {
  refs.form.addEventListener("submit", handleSubmit);
  refs.loadSampleBtn.addEventListener("click", handleLoadSample);
  refs.clearStorageBtn.addEventListener("click", handleClearStorage);
  refs.toggleDetailBtn.addEventListener("click", handleToggleDetail);
  refs.exportCsvBtn.addEventListener("click", handleExportCsv);
  refs.exportIcsBtn.addEventListener("click", handleExportIcs);
  refs.saveSessionBtn.addEventListener("click", handleSaveSession);
  refs.form.addEventListener("reset", () => setTimeout(resetView, 0));
}

async function loadRules() {
  try {
    const response = await fetch("rules/JP_2025_Yamato.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("ルールJSONの読み込みに失敗したため内蔵定義を使用します", error);
    return cloneDeep(BUILTIN_RULES);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const inputs = collectInputs(refs.form);
  if (!inputs) return;
  const { entries, summary } = buildSchedule(inputs, state.rules);
  state.inputs = inputs;
  state.entries = entries;
  state.summary = summary;
  state.detailVisible = false;
  renderSummary(summary);
  renderSchedule(entries);
  enableActions();
}

function collectInputs(form) {
  const formData = new FormData(form);
  const wifeSalary = Number(formData.get("wifeSalary"));
  const husbandSalary = Number(formData.get("husbandSalary"));
  const dueDateStr = formData.get("dueDate");
  if (!Number.isFinite(wifeSalary) || wifeSalary <= 0) {
    alert("妻の月給を正しく入力してください。");
    return null;
  }
  if (!Number.isFinite(husbandSalary) || husbandSalary <= 0) {
    alert("夫の月給を正しく入力してください。");
    return null;
  }
  if (!dueDateStr) {
    alert("出産予定日を入力してください。");
    return null;
  }
  const motherLeaveEndStr = formData.get("motherLeaveEnd");
  return {
    wifeSalary,
    husbandSalary,
    dueDate: dueDateStr,
    useSickLeave: formData.get("useSickLeave") === "on",
    motherLeaveEnd: motherLeaveEndStr || null
  };
}

function handleLoadSample() {
  applyInputs(SAMPLE_INPUT);
  refs.form.dispatchEvent(new Event("submit", { cancelable: true }));
}

function handleClearStorage() {
  if (!confirm("保存データを削除しますか？")) return;
  const existed = localStorage.getItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
  alert(existed ? "保存データを削除しました。" : "保存データはありません。");
}

function handleToggleDetail() {
  if (!state.entries || !state.entries.length) return;
  state.detailVisible = !state.detailVisible;
  renderSchedule(state.entries);
}

function applyInputs(inputs) {
  refs.form.wifeSalary.value = inputs.wifeSalary;
  refs.form.husbandSalary.value = inputs.husbandSalary;
  refs.form.dueDate.value = inputs.dueDate;
  refs.form.useSickLeave.checked = Boolean(inputs.useSickLeave);
  refs.form.motherLeaveEnd.value = inputs.motherLeaveEnd ?? "";
}

function resetView() {
  refs.summaryCards.innerHTML = "";
  refs.summaryCards.appendChild(createStatCard("情報を入力してください", "-"));
  state.detailVisible = false;
  renderEmptySchedule();
  state.entries = [];
  state.summary = null;
  state.inputs = null;
  disableActions();
}
function buildSchedule(inputs, rules) {
  const ctx = createContext(inputs, rules);
  const entries = [];
  if (inputs.useSickLeave) addSicknessEntries(entries, ctx, rules);
  addMaternityEntries(entries, ctx, rules);
  addChildbirthLumpSum(entries, ctx, rules);
  addMotherChildcare(entries, ctx, rules);
  addMotherPostBirthSupport(entries, ctx, rules);
  addFatherChildcare(entries, ctx, rules);
  addFatherPostBirthSupport(entries, ctx, rules);
  addChildAllowance(entries, ctx, rules);
  addCityMedicalSubsidy(entries, ctx, rules);
  addAdministrativeTasks(entries, ctx, rules);
  entries.sort((a, b) => {
    if (a._sortDate === b._sortDate) {
      return a.type === b.type ? 0 : a.type === "申請" ? -1 : 1;
    }
    return a._sortDate - b._sortDate;
  });
  const summary = computeSummary(entries);
  return { entries, summary };
}

function createContext(inputs, rules) {
  const dueDate = parseDate(inputs.dueDate);
  const birthDate = dueDate;
  const prenatalStart = addDays(birthDate, -rules.allowances.maternity.prenatal_days);
  const prenatalEnd = addDays(birthDate, -1);
  const postnatalStart = birthDate;
  const postnatalEnd = addDays(birthDate, rules.allowances.maternity.postnatal_days - 1);
  const motherChildcareStart = addDays(postnatalEnd, 1);
  const defaultMotherLeaveEnd = inputs.motherLeaveEnd ? parseDate(inputs.motherLeaveEnd) : addDays(addMonths(birthDate, 12), -1);
  const motherLeaveEnd = defaultMotherLeaveEnd < motherChildcareStart ? motherChildcareStart : defaultMotherLeaveEnd;
  const fatherLeaveStart = addDays(birthDate, rules.defaults.father_leave_start_offset_days);
  const fatherLeaveEnd = addDays(fatherLeaveStart, rules.defaults.father_leave_days - 1);
  const pregnancyStart = addDays(dueDate, -rules.defaults.gestation_days);
  return {
    dueDate,
    birthDate,
    prenatalStart,
    prenatalEnd,
    postnatalStart,
    postnatalEnd,
    motherChildcareStart,
    motherLeaveEnd,
    fatherLeaveStart,
    fatherLeaveEnd,
    pregnancyStart,
    daily: {
      wife: inputs.wifeSalary / 30,
      husband: inputs.husbandSalary / 30
    }
  };
}

function addSicknessEntries(entries, ctx, rules) {
  const conf = rules.allowances.sickness;
  const contact = rules.contacts.health_insurance;
  const start = maxDate(parseDate(conf.default_start), ctx.pregnancyStart);
  const end = minDate(addDays(start, (conf.default_duration_days || 90) - 1), addDays(ctx.prenatalStart, -1));
  if (!start || !end || end < start) return;
  const totalDays = diffDays(start, end) + 1;
  const payableDays = Math.max(0, totalDays - (conf.waiting_days || 0));
  const amount = Math.round(ctx.daily.wife * conf.rate * payableDays);
  const applyDeadline = endOfMonth(addMonths(end, 2));
  const expectedDeposit = endOfMonth(addMonths(end, 3));
  entries.push(createEntry({
    type: "申請",
    label: "傷病手当金",
    schemeCategory: "健康保険",
    target: "妻",
    periodStart: start,
    periodEnd: end,
    applyStart: addDays(end, 1),
    applyDeadline,
    submitTo: contact,
    documents: rules.documents.sickness_allowance,
    payoutRate: conf.rate * 100,
    targetDays: payableDays,
    payoutUnitStart: start,
    payoutUnitEnd: end,
    expectedDeposit,
    contact,
    referenceUrl: rules.urls.sickness_allowance,
    note: "待期3日後から支給対象"
  }));
  entries.push(createEntry({
    type: "給付",
    label: "傷病手当金",
    schemeCategory: "健康保険",
    target: "妻",
    amount,
    periodStart: start,
    periodEnd: end,
    applyStart: addDays(end, 1),
    applyDeadline,
    submitTo: contact,
    documents: rules.documents.sickness_allowance,
    payoutRate: conf.rate * 100,
    targetDays: payableDays,
    payoutUnitStart: start,
    payoutUnitEnd: end,
    expectedDeposit,
    contact,
    referenceUrl: rules.urls.sickness_allowance,
    note: "待期控除後の支給見込み"
  }));
}

function addMaternityEntries(entries, ctx, rules) {
  const conf = rules.allowances.maternity;
  const contact = rules.contacts.health_insurance;
  const prenatalDays = diffDays(ctx.prenatalStart, ctx.prenatalEnd) + 1;
  const postnatalDays = diffDays(ctx.postnatalStart, ctx.postnatalEnd) + 1;
  const applyDeadline = endOfMonth(addMonths(ctx.postnatalEnd, 2));
  const expectedDeposit = endOfMonth(addMonths(ctx.postnatalEnd, 2));
  const prenatalAmount = Math.round(ctx.daily.wife * conf.rate * prenatalDays);
  const postnatalAmount = Math.round(ctx.daily.wife * conf.rate * postnatalDays);
  entries.push(createEntry({
    type: "申請",
    label: "出産手当金",
    schemeCategory: "健康保険",
    target: "妻",
    periodStart: ctx.prenatalStart,
    periodEnd: ctx.postnatalEnd,
    applyStart: ctx.postnatalStart,
    applyDeadline,
    submitTo: contact,
    documents: rules.documents.maternity_allowance,
    payoutRate: conf.rate * 100,
    targetDays: prenatalDays + postnatalDays,
    payoutUnitStart: ctx.prenatalStart,
    payoutUnitEnd: ctx.postnatalEnd,
    expectedDeposit,
    contact,
    referenceUrl: rules.urls.maternity_allowance,
    note: "産前98日・産後56日分をまとめて申請"
  }));
  entries.push(createEntry({
    type: "給付",
    label: "出産手当金（産前）",
    schemeCategory: "健康保険",
    target: "妻",
    amount: prenatalAmount,
    periodStart: ctx.prenatalStart,
    periodEnd: ctx.prenatalEnd,
    applyStart: ctx.postnatalStart,
    applyDeadline,
    submitTo: contact,
    documents: rules.documents.maternity_allowance,
    payoutRate: conf.rate * 100,
    targetDays: prenatalDays,
    payoutUnitStart: ctx.prenatalStart,
    payoutUnitEnd: ctx.prenatalEnd,
    expectedDeposit,
    contact,
    referenceUrl: rules.urls.maternity_allowance,
    note: "産前分の支給見込み"
  }));
  entries.push(createEntry({
    type: "給付",
    label: "出産手当金（産後）",
    schemeCategory: "健康保険",
    target: "妻",
    amount: postnatalAmount,
    periodStart: ctx.postnatalStart,
    periodEnd: ctx.postnatalEnd,
    applyStart: ctx.postnatalStart,
    applyDeadline,
    submitTo: contact,
    documents: rules.documents.maternity_allowance,
    payoutRate: conf.rate * 100,
    targetDays: postnatalDays,
    payoutUnitStart: ctx.postnatalStart,
    payoutUnitEnd: ctx.postnatalEnd,
    expectedDeposit,
    contact,
    referenceUrl: rules.urls.maternity_allowance,
    note: "産後分の支給見込み"
  }));
}

function addChildbirthLumpSum(entries, ctx, rules) {
  const conf = rules.allowances.childbirth_lump_sum;
  const contact = rules.contacts.hospital;
  const amount = conf.amount_per_child * conf.multiple_birth_multiplier;
  const applyStart = addWeeks(ctx.pregnancyStart, 22);
  entries.push(createEntry({
    type: "申請",
    label: "出産育児一時金 直接支払制度",
    schemeCategory: "健康保険",
    target: "妻",
    periodStart: applyStart,
    periodEnd: ctx.birthDate,
    applyStart,
    applyDeadline: ctx.birthDate,
    submitTo: contact,
    documents: rules.documents.childbirth_lump_sum,
    payoutRate: null,
    targetDays: null,
    payoutUnitStart: ctx.birthDate,
    payoutUnitEnd: ctx.birthDate,
    expectedDeposit: ctx.birthDate,
    contact,
    referenceUrl: rules.urls.childbirth_lump_sum,
    note: "妊娠22週以降に同意書提出"
  }));
  entries.push(createEntry({
    type: "給付",
    label: "出産育児一時金（双子）",
    schemeCategory: "健康保険",
    target: "妻",
    amount,
    periodStart: ctx.birthDate,
    periodEnd: ctx.birthDate,
    applyStart,
    applyDeadline: ctx.birthDate,
    submitTo: contact,
    documents: rules.documents.childbirth_lump_sum,
    payoutRate: null,
    targetDays: 1,
    payoutUnitStart: ctx.birthDate,
    payoutUnitEnd: ctx.birthDate,
    expectedDeposit: ctx.birthDate,
    contact,
    referenceUrl: rules.urls.childbirth_lump_sum,
    note: "双子分 100万円"
  }));
}

function addMotherChildcare(entries, ctx, rules) {
  const conf = rules.allowances.childcare;
  const contact = rules.contacts.hello_work;
  entries.push(createEntry({
    type: "申請",
    label: "育児休業給付金（母開始）",
    schemeCategory: "雇用保険",
    target: "妻",
    periodStart: ctx.motherChildcareStart,
    periodEnd: ctx.motherLeaveEnd,
    applyStart: ctx.motherChildcareStart,
    applyDeadline: endOfMonth(addMonths(ctx.motherChildcareStart, 4)),
    submitTo: contact,
    documents: rules.documents.childcare_leave,
    payoutRate: conf.phase1_rate * 100,
    targetDays: diffDays(ctx.motherChildcareStart, ctx.motherLeaveEnd) + 1,
    payoutUnitStart: ctx.motherChildcareStart,
    payoutUnitEnd: ctx.motherLeaveEnd,
    expectedDeposit: endOfMonth(addMonths(ctx.motherChildcareStart, 2)),
    contact,
    referenceUrl: rules.urls.childcare_leave,
    note: "会社経由で2か月ごとに申請"
  }));
  for (const segment of splitByMonth(ctx.motherChildcareStart, ctx.motherLeaveEnd)) {
    const amount = calculateChildcareAmount(segment.start, segment.end, ctx.motherChildcareStart, ctx.daily.wife, conf);
    const avgRate = computeAverageRate(amount, segment.start, segment.end, ctx.daily.wife);
    entries.push(createEntry({
      type: "給付",
      label: `育児休業給付金（母） ${formatYearMonth(segment.start)}`,
      schemeCategory: "雇用保険",
      target: "妻",
      amount,
      periodStart: segment.start,
      periodEnd: segment.end,
      applyStart: segment.start,
      applyDeadline: endOfMonth(addMonths(segment.start, 4)),
      submitTo: contact,
      documents: rules.documents.childcare_leave,
      payoutRate: avgRate * 100,
      targetDays: diffDays(segment.start, segment.end) + 1,
      payoutUnitStart: segment.start,
      payoutUnitEnd: segment.end,
      expectedDeposit: endOfMonth(addMonths(segment.end, 2)),
      contact,
      referenceUrl: rules.urls.childcare_leave,
      note: "2か月単位で支給（表示は月割り）"
    }));
  }
}

function addMotherPostBirthSupport(entries, ctx, rules) {
  const conf = rules.allowances.post_birth_support;
  const contact = rules.contacts.hello_work;
  const start = ctx.motherChildcareStart;
  const end = minDate(addDays(start, conf.duration_days - 1), addDays(ctx.birthDate, conf.mother_window_weeks * 7 - 1), ctx.motherLeaveEnd);
  if (!start || !end || end < start) return;
  const duration = diffDays(start, end) + 1;
  const amount = Math.round(ctx.daily.wife * conf.extra_rate * duration);
  entries.push(createEntry({
    type: "申請",
    label: "出生後休業支援給付金（母）",
    schemeCategory: "雇用保険",
    target: "妻",
    periodStart: start,
    periodEnd: end,
    applyStart: start,
    applyDeadline: endOfMonth(addMonths(end, 2)),
    submitTo: contact,
    documents: rules.documents.post_birth_support,
    payoutRate: conf.extra_rate * 100,
    targetDays: duration,
    payoutUnitStart: start,
    payoutUnitEnd: end,
    expectedDeposit: endOfMonth(addMonths(end, 2)),
    contact,
    referenceUrl: rules.urls.post_birth_support,
    note: "産後休業明け最初の28日が対象"
  }));
  entries.push(createEntry({
    type: "給付",
    label: "出生後休業支援給付金（母）",
    schemeCategory: "雇用保険",
    target: "妻",
    amount,
    periodStart: start,
    periodEnd: end,
    applyStart: start,
    applyDeadline: endOfMonth(addMonths(end, 2)),
    submitTo: contact,
    documents: rules.documents.post_birth_support,
    payoutRate: conf.extra_rate * 100,
    targetDays: duration,
    payoutUnitStart: start,
    payoutUnitEnd: end,
    expectedDeposit: endOfMonth(addMonths(end, 2)),
    contact,
    referenceUrl: rules.urls.post_birth_support,
    note: "67%分への上乗せ13%"
  }));
}

function addFatherChildcare(entries, ctx, rules) {
  const conf = rules.allowances.childcare;
  const contact = rules.contacts.hello_work;
  const start = ctx.fatherLeaveStart;
  const end = ctx.fatherLeaveEnd;
  entries.push(createEntry({
    type: "申請",
    label: "育児休業給付金（父開始）",
    schemeCategory: "雇用保険",
    target: "夫",
    periodStart: start,
    periodEnd: end,
    applyStart: start,
    applyDeadline: endOfMonth(addMonths(start, 4)),
    submitTo: contact,
    documents: rules.documents.childcare_leave,
    payoutRate: conf.phase1_rate * 100,
    targetDays: diffDays(start, end) + 1,
    payoutUnitStart: start,
    payoutUnitEnd: end,
    expectedDeposit: endOfMonth(addMonths(start, 2)),
    contact,
    referenceUrl: rules.urls.childcare_leave,
    note: "出生日翌日から1年間取得"
  }));
  for (const segment of splitByMonth(start, end)) {
    const amount = calculateChildcareAmount(segment.start, segment.end, start, ctx.daily.husband, conf);
    const avgRate = computeAverageRate(amount, segment.start, segment.end, ctx.daily.husband);
    entries.push(createEntry({
      type: "給付",
      label: `育児休業給付金（父） ${formatYearMonth(segment.start)}`,
      schemeCategory: "雇用保険",
      target: "夫",
      amount,
      periodStart: segment.start,
      periodEnd: segment.end,
      applyStart: segment.start,
      applyDeadline: endOfMonth(addMonths(segment.start, 4)),
      submitTo: contact,
      documents: rules.documents.childcare_leave,
      payoutRate: avgRate * 100,
      targetDays: diffDays(segment.start, segment.end) + 1,
      payoutUnitStart: segment.start,
      payoutUnitEnd: segment.end,
      expectedDeposit: endOfMonth(addMonths(segment.end, 2)),
      contact,
      referenceUrl: rules.urls.childcare_leave,
      note: "2か月単位支給（表示は月割り）"
    }));
  }
}

function addFatherPostBirthSupport(entries, ctx, rules) {
  const conf = rules.allowances.post_birth_support;
  const contact = rules.contacts.hello_work;
  const start = ctx.fatherLeaveStart;
  const end = minDate(addDays(start, conf.duration_days - 1), addDays(ctx.birthDate, conf.father_window_weeks * 7 - 1), ctx.fatherLeaveEnd);
  if (!start || !end || end < start) return;
  const duration = diffDays(start, end) + 1;
  const amount = Math.round(ctx.daily.husband * conf.extra_rate * duration);
  entries.push(createEntry({
    type: "申請",
    label: "出生後休業支援給付金（父）",
    schemeCategory: "雇用保険",
    target: "夫",
    periodStart: start,
    periodEnd: end,
    applyStart: start,
    applyDeadline: endOfMonth(addMonths(end, 2)),
    submitTo: contact,
    documents: rules.documents.post_birth_support,
    payoutRate: conf.extra_rate * 100,
    targetDays: duration,
    payoutUnitStart: start,
    payoutUnitEnd: end,
    expectedDeposit: endOfMonth(addMonths(end, 2)),
    contact,
    referenceUrl: rules.urls.post_birth_support,
    note: "産後8週以内に開始する最初の28日"
  }));
  entries.push(createEntry({
    type: "給付",
    label: "出生後休業支援給付金（父）",
    schemeCategory: "雇用保険",
    target: "夫",
    amount,
    periodStart: start,
    periodEnd: end,
    applyStart: start,
    applyDeadline: endOfMonth(addMonths(end, 2)),
    submitTo: contact,
    documents: rules.documents.post_birth_support,
    payoutRate: conf.extra_rate * 100,
    targetDays: duration,
    payoutUnitStart: start,
    payoutUnitEnd: end,
    expectedDeposit: endOfMonth(addMonths(end, 2)),
    contact,
    referenceUrl: rules.urls.post_birth_support,
    note: "67%分への上乗せ13%"
  }));
}
function addChildAllowance(entries, ctx, rules) {
  const conf = rules.allowances.child_allowance;
  const contact = rules.contacts.city_office;
  const monthlyAmount = conf.amount_per_child * (rules.defaults.multiple_birth ? 2 : 1);
  entries.push(createEntry({
    type: "申請",
    label: "児童手当認定請求",
    schemeCategory: "自治体",
    target: "世帯",
    periodStart: ctx.birthDate,
    periodEnd: ctx.birthDate,
    applyStart: ctx.birthDate,
    applyDeadline: endOfMonth(addMonths(ctx.birthDate, 4)),
    submitTo: contact,
    documents: rules.documents.child_allowance,
    payoutRate: null,
    targetDays: null,
    payoutUnitStart: ctx.birthDate,
    payoutUnitEnd: ctx.birthDate,
    expectedDeposit: null,
    contact,
    referenceUrl: rules.urls.child_allowance,
    note: "出生後15日以内に提出"
  }));
  const blocks = accumulateMonthly(ctx.birthDate, ctx.fatherLeaveEnd, monthlyAmount, conf.payment_months);
  for (const block of blocks) {
    entries.push(createEntry({
      type: "給付",
      label: "児童手当",
      schemeCategory: "自治体",
      target: "世帯",
      amount: block.amount,
      periodStart: block.unitStart,
      periodEnd: block.unitEnd,
      applyStart: block.unitStart,
      applyDeadline: block.paymentDate,
      submitTo: contact,
      documents: rules.documents.child_allowance,
      payoutRate: null,
      targetDays: diffDays(block.unitStart, block.unitEnd) + 1,
      payoutUnitStart: block.unitStart,
      payoutUnitEnd: block.unitEnd,
      expectedDeposit: block.paymentDate,
      contact,
      referenceUrl: rules.urls.child_allowance,
      note: `${block.months}か月分まとめて支給`
    }));
  }
}

function addCityMedicalSubsidy(entries, ctx, rules) {
  const contact = rules.contacts.city_office;
  entries.push(createEntry({
    type: "申請",
    label: "乳幼児医療費助成",
    schemeCategory: "自治体",
    target: "世帯",
    periodStart: addWeeks(ctx.birthDate, 1),
    periodEnd: addWeeks(ctx.birthDate, 1),
    applyStart: addWeeks(ctx.birthDate, 1),
    applyDeadline: endOfMonth(addMonths(ctx.birthDate, 6)),
    submitTo: contact,
    documents: rules.documents.child_medical,
    payoutRate: null,
    targetDays: null,
    payoutUnitStart: ctx.birthDate,
    payoutUnitEnd: ctx.birthDate,
    expectedDeposit: null,
    contact,
    referenceUrl: rules.urls.child_medical,
    note: "医療証交付で自己負担ゼロ"
  }));
}

function addAdministrativeTasks(entries, ctx, rules) {
  const city = rules.contacts.city_office;
  const hospital = rules.contacts.hospital;
  entries.push(createEntry({
    type: "申請",
    label: "妊娠届・母子健康手帳",
    schemeCategory: "自治体",
    target: "妻",
    periodStart: ctx.pregnancyStart,
    periodEnd: ctx.pregnancyStart,
    applyStart: ctx.pregnancyStart,
    applyDeadline: addWeeks(ctx.pregnancyStart, 6),
    submitTo: city,
    documents: ["妊婦本人確認書類"],
    payoutRate: null,
    targetDays: null,
    payoutUnitStart: ctx.pregnancyStart,
    payoutUnitEnd: ctx.pregnancyStart,
    expectedDeposit: null,
    contact: city,
    referenceUrl: rules.urls.child_allowance,
    note: "母子健康手帳と健診券を受領"
  }));
  entries.push(createEntry({
    type: "申請",
    label: "北里病院 直接支払同意書",
    schemeCategory: "医療機関",
    target: "妻",
    periodStart: addWeeks(ctx.pregnancyStart, 22),
    periodEnd: addWeeks(ctx.pregnancyStart, 22),
    applyStart: addWeeks(ctx.pregnancyStart, 22),
    applyDeadline: ctx.birthDate,
    submitTo: hospital,
    documents: ["保険証", "身分証"],
    payoutRate: null,
    targetDays: null,
    payoutUnitStart: ctx.birthDate,
    payoutUnitEnd: ctx.birthDate,
    expectedDeposit: null,
    contact: hospital,
    referenceUrl: rules.urls.childbirth_lump_sum,
    note: "入院前に窓口へ提出"
  }));
  entries.push(createEntry({
    type: "申請",
    label: "出生届",
    schemeCategory: "自治体",
    target: "世帯",
    periodStart: ctx.birthDate,
    periodEnd: ctx.birthDate,
    applyStart: ctx.birthDate,
    applyDeadline: addDays(ctx.birthDate, 14),
    submitTo: city,
    documents: ["出生証明書", "母子健康手帳", "届出人印"],
    payoutRate: null,
    targetDays: null,
    payoutUnitStart: ctx.birthDate,
    payoutUnitEnd: ctx.birthDate,
    expectedDeposit: null,
    contact: city,
    referenceUrl: rules.urls.child_allowance,
    note: "出生後14日以内"
  }));
}

function computeSummary(entries) {
  let totalWife = 0;
  let totalHusband = 0;
  let totalHousehold = 0;
  let tasks = 0;
  let coverageStart = null;
  let coverageEnd = null;
  for (const entry of entries) {
    if (entry.type === "給付" && entry.amountNumber) {
      if (entry.target === "妻") totalWife += entry.amountNumber;
      else if (entry.target === "夫") totalHusband += entry.amountNumber;
      else totalHousehold += entry.amountNumber;
    }
    if (entry.type === "申請") tasks += 1;
    const start = entry.periodStartDate || entry.payoutUnitStartDate || entry.applyStartDate;
    const end = entry.periodEndDate || entry.payoutUnitEndDate || entry.applyDeadlineDate;
    if (start && (!coverageStart || start < coverageStart)) coverageStart = start;
    if (end && (!coverageEnd || end > coverageEnd)) coverageEnd = end;
  }
  return {
    totalWife,
    totalHusband,
    totalHousehold: totalWife + totalHusband + totalHousehold,
    tasks,
    coverageStart,
    coverageEnd,
    entryCount: entries.length
  };
}

function renderSummary(summary) {
  refs.summaryCards.innerHTML = "";
  const cards = [
    ["家計合計給付見込み", formatCurrency(summary.totalHousehold)],
    ["妻の給付額", formatCurrency(summary.totalWife)],
    ["夫の給付額", formatCurrency(summary.totalHusband)],
    ["申請タスク数", `${summary.tasks} 件`]
  ];
  if (summary.coverageStart && summary.coverageEnd) {
    cards.push(["対象期間", `${formatDate(summary.coverageStart)} 〜 ${formatDate(summary.coverageEnd)}`]);
  }
  for (const [title, value] of cards) {
    refs.summaryCards.appendChild(createStatCard(title, value));
  }
}


function renderSchedule(entries) {
  if (!entries.length) {
    renderEmptySchedule();
    updateToggleButton();
    return;
  }
  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";
  wrapper.appendChild(renderSimpleTable(entries));
  if (state.detailVisible) {
    wrapper.appendChild(renderDetailedTable(entries));
  }
  refs.scheduleContainer.innerHTML = "";
  refs.scheduleContainer.appendChild(wrapper);
  updateToggleButton();
}

function renderSimpleTable(entries) {
  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  const table = document.createElement("table");
  table.className = "simple-table";
  const headers = ["タイトル", "年/月", "種別", "名称", "金額見込み(円)", "備考"];
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  const tbody = document.createElement("tbody");
  for (const entry of entries) {
    const row = document.createElement("tr");
    const title = entry.label || entry.type || "";
    const yearMonth = entry.yearMonth || deriveYearMonth(entry);
    const type = entry.type || "";
    const name = entry.label || "";
    const amount = entry.amountDisplay || "";
    const note = entry.note || entry.schemeCategory || "";
    [title, yearMonth, type, name, amount, note].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value || "";
      row.appendChild(td);
    });
    tbody.appendChild(row);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  scroll.appendChild(table);
  return scroll;
}

function renderDetailedTable(entries) {
  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  const table = document.createElement("table");
  table.className = "detailed-table";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const col of COLUMN_CONFIG) {
    const th = document.createElement("th");
    th.textContent = col.header;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  const tbody = document.createElement("tbody");
  for (const entry of entries) {
    const row = document.createElement("tr");
    for (const col of COLUMN_CONFIG) {
      const td = document.createElement("td");
      if (col.key === "type") {
        td.innerHTML = `<div><span class="badge">${entry.type}</span><div>${escapeHtml(entry.label)}</div></div>`;
      } else if (col.key === "amountDisplay") {
        td.textContent = entry.amountDisplay || "";
      } else if (col.key === "payoutRateDisplay") {
        td.textContent = entry.payoutRateDisplay ? `${entry.payoutRateDisplay}` : "";
      } else if (col.key === "targetDaysDisplay") {
        td.textContent = entry.targetDaysDisplay;
      } else if (col.key === "documentsDisplay") {
        td.textContent = entry.documentsDisplay;
      } else if (col.key === "actualAmountDisplay") {
        td.textContent = entry.actualAmountDisplay || "";
      } else if (col.key === "contactDisplay") {
        td.textContent = entry.contactDisplay;
      } else if (col.key === "referenceUrl") {
        if (entry.referenceUrl) {
          const link = document.createElement("a");
          link.href = entry.referenceUrl;
          link.textContent = "リンク";
          link.target = "_blank";
          link.rel = "noopener";
          td.appendChild(link);
        }
      } else {
        td.textContent = entry[col.key] || "";
      }
      row.appendChild(td);
    }
    tbody.appendChild(row);
  }
  table.append(thead, tbody);
  scroll.appendChild(table);
  return scroll;
}

function renderEmptySchedule() {
  refs.scheduleContainer.innerHTML = '<div id="empty-state">まだ計算が実行されていません。</div>';
  updateToggleButton();
}

function deriveYearMonth(entry) {
  const source = entry.periodStart || entry.payoutUnitStart || entry.applyStart || entry.applyDeadline;
  return source ? source.slice(0, 7) : "";
}

function updateToggleButton() {
  if (!refs.toggleDetailBtn) return;
  const hasEntries = !!(state.entries && state.entries.length);
  if (!hasEntries && state.detailVisible) {
    state.detailVisible = false;
  }
  refs.toggleDetailBtn.disabled = !hasEntries;
  refs.toggleDetailBtn.textContent = state.detailVisible ? "詳細列を閉じる" : "詳細列を表示";
}

function disableActions() {
  if (refs.toggleDetailBtn) {
    refs.toggleDetailBtn.disabled = true;
  }
  refs.exportCsvBtn.disabled = true;
  refs.exportIcsBtn.disabled = true;
  refs.saveSessionBtn.disabled = true;
  updateToggleButton();
}

function enableActions() {
  const hasEntries = !!(state.entries && state.entries.length);
  if (refs.toggleDetailBtn) {
    refs.toggleDetailBtn.disabled = !hasEntries;
  }
  refs.exportCsvBtn.disabled = !hasEntries;
  refs.exportIcsBtn.disabled = !hasEntries;
  refs.saveSessionBtn.disabled = !hasEntries;
  updateToggleButton();
}
function disableActions() {
  refs.exportCsvBtn.disabled = true;
  refs.exportIcsBtn.disabled = true;
  refs.saveSessionBtn.disabled = true;
}

function enableActions() {
  const hasEntries = !!(state.entries && state.entries.length);
  refs.exportCsvBtn.disabled = !hasEntries;
  refs.exportIcsBtn.disabled = !hasEntries;
  refs.saveSessionBtn.disabled = !hasEntries;
}

function createStatCard(title, value) {
  const card = document.createElement("div");
  card.className = "stat-card";
  const h3 = document.createElement("h3");
  h3.textContent = title;
  const p = document.createElement("p");
  p.textContent = value;
  card.append(h3, p);
  return card;
}

function splitByMonth(start, end) {
  const segments = [];
  if (!start || !end) return segments;
  let cursor = start;
  while (cursor <= end) {
    const segmentEnd = minDate(end, endOfMonth(cursor));
    segments.push({ start: cursor, end: segmentEnd });
    cursor = addDays(segmentEnd, 1);
  }
  return segments;
}

function calculateChildcareAmount(segmentStart, segmentEnd, globalStart, dailySalary, conf) {
  let amount = 0;
  for (let date = segmentStart; date <= segmentEnd; date = addDays(date, 1)) {
    const offset = diffDays(globalStart, date);
    const rate = offset < conf.phase1_days ? conf.phase1_rate : conf.phase2_rate;
    amount += dailySalary * rate;
  }
  return Math.round(amount);
}

function computeAverageRate(amount, start, end, dailySalary) {
  const days = diffDays(start, end) + 1;
  if (days <= 0 || dailySalary <= 0) return 0;
  return amount / (dailySalary * days);
}
function accumulateMonthly(startDate, endDate, monthlyAmount, paymentMonths) {
  const blocks = [];
  if (!startDate || !endDate) return blocks;
  let cursor = startOfMonth(startDate);
  const limit = endOfMonth(endDate);
  let bucketAmount = 0;
  let bucketStart = cursor;
  let months = 0;
  while (cursor <= limit) {
    bucketAmount += monthlyAmount;
    months += 1;
    if (paymentMonths.includes(cursor.getUTCMonth() + 1)) {
      const paymentDate = endOfMonth(cursor);
      blocks.push({
        amount: bucketAmount,
        unitStart: bucketStart,
        unitEnd: endOfMonth(cursor),
        paymentDate,
        months
      });
      bucketAmount = 0;
      months = 0;
      bucketStart = addDays(endOfMonth(cursor), 1);
    }
    cursor = addMonths(cursor, 1);
  }
  return blocks.filter(block => block.amount > 0);
}

function parseDate(value) {
  if (!value) return null;
  const y = Number(value.slice(0, 4));
  const m = Number(value.slice(5, 7));
  const d = Number(value.slice(8, 10));
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDate(date) {
  if (!date) return "";
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatYearMonth(date) {
  if (!date) return "";
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function addDays(date, days) {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function addWeeks(date, weeks) {
  return addDays(date, weeks * 7);
}

function addMonths(date, months) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const totalMonths = month + months;
  const targetYear = year + Math.floor(totalMonths / 12);
  const targetMonth = ((totalMonths % 12) + 12) % 12;
  const lastDay = daysInMonth(targetYear, targetMonth);
  const targetDay = Math.min(day, lastDay);
  return new Date(Date.UTC(targetYear, targetMonth, targetDay));
}

function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

function diffDays(start, end) {
  const MS = 24 * 60 * 60 * 1000;
  return Math.round((end - start) / MS);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function minDate(...dates) {
  const filtered = dates.filter(Boolean);
  if (!filtered.length) return null;
  return filtered.reduce((min, current) => (current < min ? current : min));
}

function maxDate(...dates) {
  const filtered = dates.filter(Boolean);
  if (!filtered.length) return null;
  return filtered.reduce((max, current) => (current > max ? current : max));
}

function formatCurrency(value) {
  if (value == null) return "";
  return new Intl.NumberFormat("ja-JP").format(Math.round(value));
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function escapeHtml(value) {
  return value ? value.replace(/[&<>\"]/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  })[ch]) : "";
}

function createEntry(options) {
  const submitTo = options.submitTo || {};
  const entry = {
    type: options.type,
    label: options.label || "",
    schemeCategory: options.schemeCategory || "",
    target: options.target || "",
    amountNumber: options.amount != null ? options.amount : null,
    periodStartDate: options.periodStart || null,
    periodEndDate: options.periodEnd || null,
    applyStartDate: options.applyStart || null,
    applyDeadlineDate: options.applyDeadline || null,
    payoutUnitStartDate: options.payoutUnitStart || options.periodStart || null,
    payoutUnitEndDate: options.payoutUnitEnd || options.periodEnd || null,
    expectedDepositDate: options.expectedDeposit || null,
    actualDepositDate: options.actualDeposit || null,
    actualAmountNumber: options.actualAmount != null ? options.actualAmount : null,
    submissionMethod: options.submissionMethod || submitTo.preferred_method || "",
    submitToType: submitTo.type || "",
    submitToName: submitTo.name || "",
    documents: Array.isArray(options.documents) ? options.documents.slice() : [],
    payoutRate: options.payoutRate != null ? options.payoutRate : null,
    targetDays: options.targetDays != null ? options.targetDays : null,
    status: options.status || "未着手",
    rejectionReason: options.rejectionReason || "",
    contact: options.contact?.phone || submitTo.phone || options.contact || "",
    contactName: options.contact?.name || submitTo.name || "",
    referenceUrl: options.referenceUrl || "",
    note: options.note || ""
  };
  const sortDate = options.sortDate || entry.periodStartDate || entry.applyStartDate || entry.payoutUnitStartDate || entry.expectedDepositDate || entry.applyDeadlineDate || entry.periodEndDate;
  entry._sortDate = sortDate ? sortDate.getTime() : Number.MAX_SAFE_INTEGER;
  entry.yearMonth = sortDate ? formatYearMonth(sortDate) : "";
  entry.periodStart = formatDate(entry.periodStartDate);
  entry.periodEnd = formatDate(entry.periodEndDate);
  entry.applyStart = formatDate(entry.applyStartDate);
  entry.applyDeadline = formatDate(entry.applyDeadlineDate);
  entry.payoutUnitStart = formatDate(entry.payoutUnitStartDate);
  entry.payoutUnitEnd = formatDate(entry.payoutUnitEndDate);
  entry.expectedDeposit = formatDate(entry.expectedDepositDate);
  entry.actualDeposit = formatDate(entry.actualDepositDate);
  entry.amountDisplay = entry.amountNumber != null ? formatCurrency(entry.amountNumber) : "";
  entry.actualAmountDisplay = entry.actualAmountNumber != null ? formatCurrency(entry.actualAmountNumber) : "";
  entry.payoutRateDisplay = entry.payoutRate != null ? (Math.round(entry.payoutRate * 10) / 10).toFixed(1) : "";
  entry.targetDaysDisplay = entry.targetDays != null ? String(entry.targetDays) : "";
  entry.documentsDisplay = entry.documents.join(", ");
  entry.contactDisplay = entry.contactName && entry.contact ? `${entry.contactName} ${entry.contact}` : (entry.contact || "");
  return entry;
}







function handleExportCsv() {
  if (!state.entries.length) {
    alert("出力するスケジュールがありません。");
    return;
  }
  const csv = generateCsv(state.entries, state.rules);
  const today = formatDate(new Date()).replace(/-/g, "");
  downloadFile(`maternity_schedule_${today}.csv`, csv, "text/csv;charset=utf-8");
}

function handleExportIcs() {
  if (!state.entries.length) {
    alert("出力するスケジュールがありません。");
    return;
  }
  const ics = generateIcs(state.entries);
  const today = formatDate(new Date()).replace(/-/g, "");
  downloadFile(`maternity_schedule_${today}.ics`, ics, "text/calendar;charset=utf-8");
}

function handleSaveSession() {
  if (!state.inputs) {
    alert("まずは計算を実行してください。");
    return;
  }
  const payload = {
    inputs: state.inputs,
    savedAt: new Date().toISOString(),
    rulesVersion: state.rules?.metadata?.version || null
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    alert("入力値と結果をブラウザに保存しました。");
  } catch (error) {
    console.error("保存に失敗しました", error);
    alert("保存に失敗しました。");
  }
}

function tryRestoreSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      disableActions();
      return;
    }
    const payload = JSON.parse(raw);
    if (!payload || !payload.inputs) {
      disableActions();
      return;
    }
    applyInputs(payload.inputs);
    refs.form.dispatchEvent(new Event("submit", { cancelable: true }));
  } catch (error) {
    console.warn("保存データの読み込みに失敗しました", error);
    disableActions();
  }
}

function generateCsv(entries, rules) {
  const headers = (rules && rules.output_columns) ? rules.output_columns.slice() : COLUMN_CONFIG.map(col => col.header);
  const rows = [];
  rows.push(headers.map(escapeCsvValue).join(","));
  for (const entry of entries) {
    const row = headers.map(header => {
      switch (header) {
        case "年/月":
          return escapeCsvValue(entry.yearMonth);
        case "種別":
          return escapeCsvValue(entry.label ? `${entry.type} | ${entry.label}` : entry.type);
        case "金額(円)":
          return escapeCsvValue(entry.amountDisplay);
        case "制度カテゴリ":
          return escapeCsvValue(entry.schemeCategory);
        case "対象者":
          return escapeCsvValue(entry.target);
        case "期間開始":
          return escapeCsvValue(entry.periodStart);
        case "期間終了":
          return escapeCsvValue(entry.periodEnd);
        case "申請開始可能日":
          return escapeCsvValue(entry.applyStart);
        case "申請期限":
          return escapeCsvValue(entry.applyDeadline);
        case "提出先(種別)":
          return escapeCsvValue(entry.submitToType);
        case "提出先(名称)":
          return escapeCsvValue(entry.submitToName);
        case "提出方法":
          return escapeCsvValue(entry.submissionMethod);
        case "必要書類":
          return escapeCsvValue(entry.documentsDisplay);
        case "支給率(%)":
          return escapeCsvValue(entry.payoutRateDisplay);
        case "対象日数":
          return escapeCsvValue(entry.targetDaysDisplay);
        case "支給単位(開始)":
          return escapeCsvValue(entry.payoutUnitStart);
        case "支給単位(終了)":
          return escapeCsvValue(entry.payoutUnitEnd);
        case "振込予定日":
          return escapeCsvValue(entry.expectedDeposit);
        case "実入金日":
          return escapeCsvValue(entry.actualDeposit);
        case "実入金額(円)":
          return escapeCsvValue(entry.actualAmountDisplay);
        case "ステータス":
          return escapeCsvValue(entry.status);
        case "差戻し理由":
          return escapeCsvValue(entry.rejectionReason);
        case "問い合わせ先":
          return escapeCsvValue(entry.contactDisplay);
        case "根拠URL":
          return escapeCsvValue(entry.referenceUrl);
        default:
          return escapeCsvValue(entry[header] ?? "");
      }
    });
    rows.push(row.join(","));
  }
  return rows.join("\r\n");
}

function escapeCsvValue(value) {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function generateIcs(entries) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Maternity Scheduler//JP",
    "CALSCALE:GREGORIAN"
  ];
  const stamp = formatDateTimeForIcs(new Date());
  let counter = 0;
  for (const entry of entries) {
    for (const event of buildIcsEvents(entry)) {
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${event.uid || `ms-${counter++}@local`}`);
      lines.push(`DTSTAMP:${stamp}`);
      lines.push(`DTSTART;VALUE=DATE:${event.date}`);
      lines.push(`SUMMARY:${escapeIcs(event.summary)}`);
      if (event.description) {
        lines.push(`DESCRIPTION:${escapeIcs(event.description)}`);
      }
      lines.push("END:VEVENT");
    }
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function buildIcsEvents(entry) {
  const events = [];
  const baseTitle = entry.label ? `${entry.label}` : entry.type;
  const target = entry.target ? ` (${entry.target})` : "";
  const descriptionParts = [];
  if (entry.schemeCategory) descriptionParts.push(`制度カテゴリ: ${entry.schemeCategory}`);
  if (entry.amountDisplay) descriptionParts.push(`金額: ${entry.amountDisplay}円`);
  if (entry.submitToName) descriptionParts.push(`提出先: ${entry.submitToName}`);
  if (entry.documentsDisplay) descriptionParts.push(`必要書類: ${entry.documentsDisplay}`);
  if (entry.contactDisplay) descriptionParts.push(`問い合わせ: ${entry.contactDisplay}`);
  if (entry.referenceUrl) descriptionParts.push(`根拠: ${entry.referenceUrl}`);
  if (entry.note) descriptionParts.push(`メモ: ${entry.note}`);
  const description = descriptionParts.join("\n");
  if (entry.applyStartDate) {
    events.push({
      date: formatDateForIcs(entry.applyStartDate),
      summary: `申請開始 ${baseTitle}${target}`,
      description
    });
  }
  if (entry.applyDeadlineDate) {
    events.push({
      date: formatDateForIcs(entry.applyDeadlineDate),
      summary: `申請期限 ${baseTitle}${target}`,
      description
    });
  }
  if (entry.expectedDepositDate) {
    events.push({
      date: formatDateForIcs(entry.expectedDepositDate),
      summary: `振込予定 ${baseTitle}${target}`,
      description
    });
  }
  return events;
}

function escapeIcs(value) {
  if (!value) return "";
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatDateForIcs(date) {
  if (!date) return "";
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function formatDateTimeForIcs(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

