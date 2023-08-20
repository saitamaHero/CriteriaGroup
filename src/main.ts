import { setupGrouper } from './grouper'
import './style.css'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="groupper">    
    <div class="groupper-actions">
      <button data-action="group" id="group">Group</button>
      <button data-action="ungroup" id="ungroup" disabled>Ungroup</button>

      <button data-action="save" id="save">save</button>
    </div>
    <div class="criteria-pattern" id="criteria-pattern">

      

    </div>
  </div>
  `
//   <span class="group">
//   <span class="block">Column X</span>
  
//   <span class="block"><span class="block-bool">AND</span> Column Y</span>
// </span >

// <span class="block"><span class="block-bool">OR</span> Column Z</span>


// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const groupper = setupGrouper(document.querySelector<HTMLDivElement>('#criteria-pattern')!)

document.querySelector("#group")!.addEventListener("click", function(e) {
  // console.log("get marked items", groupper.getMarkedItems())

  groupper.groupItems()
})

document.querySelector("#ungroup")!.addEventListener("click", function(e) {
  console.log("get marked group")
})

document.querySelector("#save")!.addEventListener("click", function(e) {
  console.log(groupper.save())
})
groupper.setCriteria({
  id: 1,
  column: "Column A",
  value: null,
  boolean: "AND"
})

groupper.setCriteria({
  id: 2,
  column: "Column B",
  value: null,
  boolean: "OR"
})

groupper.setCriteria({
  id: 3,
  column: "Column C",
  value: null,
  boolean: "OR"
})

groupper.setCriteria({
  id: 4,
  column: "Column D",
  value: null,
  boolean: "AND"
})
groupper.setCriteria({
  id: 5,
  column: "Status",
  value: null,
  boolean: "AND"
})