
document.addEventListener("DOMContentLoaded", () => {
  init();
});

let courses: CourseInfo[] = [];

function init() {

  getCourses();

  const form = document.querySelector<HTMLButtonElement>("#form");

  if (form !== null) {
    form.addEventListener("submit", (event: SubmitEvent) => {
      getFormData(event);
    })
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

  if (!cCode || !cName || !cProg || !cSyllabus) {
    return;
  }

  addCourse(cCode.value, cName.value, cProg.value, cSyllabus.value);

}

interface CourseInfo {
  code: string;
  name: string;
  progression: "A" | "B" | "C";
  syllabus: string;
}



function addCourse(code: string, name: string, progression: string, syllabus: string): void {

  if (progression !== "A" && progression !== "B" && progression !== "C") {
    return;
  }

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

    list.innerHTML += "";

    courses.forEach(course => {

      list.innerHTML = `
        <div class="course">
          <div class="course-header">
            <h4>${course.name}</h4>
            <p>${course.code}</p>
            <p>${course.progression}</p>
          </div>
          <div>
            <p class="syllabus">${course.syllabus}</p>
            <button class="delete-btn"><span class="material-symbols-outlined" data-code="${course.code}">delete</span></button>
          </div>
        </div>
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