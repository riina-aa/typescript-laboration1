
document.addEventListener("DOMContentLoaded", () => {
  init();
});

let courses: CourseInfo[] = [];

function init(): void {

  getCourses();
  renderCourses();

  const form = document.querySelector<HTMLFormElement>("#form");

  if (form) {
    form.addEventListener("submit", getFormData)
  }
}

function getCourses(): void {

  const storedCourses: string | null = localStorage.getItem("courses");

  if (storedCourses !== null) {
    courses = JSON.parse(storedCourses) as CourseInfo[];
  }
};


function getFormData(event: SubmitEvent): void {

  event.preventDefault();

  const cCode = document.querySelector<HTMLInputElement>("#cCode");
  const cName = document.querySelector<HTMLInputElement>("#cName");
  const cProg = document.querySelector<HTMLInputElement>("#cProg");
  const cSyllabus = document.querySelector<HTMLInputElement>("#cSyllabus");
  const errorContainer = document.querySelector<HTMLDivElement>(".error");

  //Kontrollerar att alla input-fält finns och inte returnerar null 
  if (!cCode || !cName || !cProg || !cSyllabus) {
    return;
  }

  if (errorContainer) {
    errorContainer.textContent = "";
  }

  //Hämtar värden
  const code = cCode.value.trim();
  const name = cName.value.trim();
  const progression = cProg.value.trim();
  const syllabus = cSyllabus.value.trim();

  //Kontrollerar tomma fält 
  if (!code || !name || !progression || !syllabus) {
    if (errorContainer) {
      errorContainer.textContent = "Du måste fylla i alla fält.";
    }
    return;
  }

  //Kontrollerar 
  if (progression !== "A" && progression !== "B" && progression !== "C") {
    if (errorContainer) {
      errorContainer.textContent = "Progressionen måste vara A, B eller C."
    }
    return;
  }

  //Kontrollerar efter dubbletter
  const checkedCode = courses.some(course => course.code === code);

  if (checkedCode) {
    if (errorContainer) {
      errorContainer.textContent = "Det finns redan en kurs med den kurskoden.";
    }
    return;
  }

  addCourse(code, name, progression, syllabus);

  const form = document.querySelector<HTMLFormElement>("#form");
  if (form) { form.reset() };

}

interface CourseInfo {
  code: string;
  name: string;
  progression: "A" | "B" | "C";
  syllabus: string;
}

function addCourse(code: string, name: string, progression: "A" | "B" | "C", syllabus: string): void {

  const course: CourseInfo = {
    code: code,
    name: name,
    progression: progression,
    syllabus: syllabus
  }

    courses.push(course);
    saveCourses();
    renderCourses();
};

function saveCourses(): void {
  localStorage.setItem("courses", JSON.stringify(courses));
}

function renderCourses(): void {

  const list = document.querySelector<HTMLDivElement>("#course-list");

  if (list !== null) {

    list.innerHTML = "";

    courses.forEach(course => {

      list.innerHTML += `
        <table>
          <tbody class="course-header">
            <tr class="course-info">
              <td>${course.code}</td>
              <td>${course.name}</td>
              <td>${course.progression}</td>
            </tr>
            <tr class="course-actions">
              <td colspan="2">
                <a href="${course.syllabus}" target="_blank">Länk till kursplan</a>
              </td>
              <td>
                <button class="delete-btn" data-code="${course.code}">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      `
    })
  }

  addDeleteListeners();

};

function addDeleteListeners(): void {

  const deleteBtns = document.querySelectorAll<HTMLButtonElement>(".delete-btn");

  deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", () => {

      let code = deleteBtn.dataset.code;

      if (code) {
        deleteCourses(code);
      }
    })
  })
}

function deleteCourses(code: string): void {

  courses = courses.filter((course: CourseInfo) => course.code !== code);

  saveCourses();
  renderCourses();
};