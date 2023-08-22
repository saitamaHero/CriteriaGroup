export interface Criteria {
  id: number;
  column: string;
  value: Array<string | number> | string | number | null;
  boolean: "AND" | "OR";
  _node?: HTMLElement;
}

export interface CriteriaGroup {
  id: string | number;
  entries: Criteria[];
  boolean: "AND" | "OR";
}

export function setupGrouper(criteriaContainer: HTMLDivElement) {
  const state: {
    criterias: Criteria[];
    markedItems: Criteria[];
    groups: CriteriaGroup[];
    markedGroups: CriteriaGroup[];
  } = {
    criterias: [],
    markedItems: [],
    markedGroups: [],
    groups: [],
  };

  function _listenClick(target) {

    target.addEventListener("click", (e) => {
      const target = e.currentTarget;

      if (state.criterias.length < 2) {
        return;
      }

      target.classList.toggle("selected");

      if (target.dataset.selected === "true") {
        target.dataset.selected = "false";
        state.markedItems = state.markedItems.filter(
          (c) => c.id != target.dataset.id
        );
      } else {
        target.dataset.selected = "true";
        const criteria = state.criterias.find((c) => c.id == target.dataset.id);

        if (criteria) {
          state.markedItems.push(criteria);
        }
      }

    });
  }

  function getMarkedItems() {
    return state.markedItems;
  }

  function _createCriteriaBoolNode(criteria: Criteria) {
    const nodeBool = document.createElement("span");
    nodeBool.className = "block-bool";
    nodeBool.appendChild(document.createTextNode(criteria.boolean));

    return nodeBool;
  }

  function _createCriteriaNode(
    criteria: Criteria,
    displayProp: keyof Criteria = "column"
  ) {
    const node = document.createElement("span");
    node.className = "block";
    node.dataset.id = String(criteria.id);

    node.appendChild(document.createTextNode(criteria[displayProp]));

    return node;
  }

  function _createCriteriaGroupNode(group: CriteriaGroup) {
    const criteriaGroup = document.createElement("span");
    criteriaGroup.className = "group";
    criteriaGroup.dataset.type = "group";
    criteriaGroup.dataset.id = group.id as string;

    group.entries.map((criteria) => {
      criteria._node = _createCriteriaNode(criteria);

      criteriaGroup.appendChild(_createCriteriaBoolNode(criteria));
      criteriaGroup.appendChild(criteria._node);
    });

    // console.log(criteriaGroup);

    return criteriaGroup;
  }

  function renderCriteriaGroup(group: CriteriaGroup, index: number) {
    const groupNode = _createCriteriaGroupNode(group);

    groupNode.addEventListener("click", function (e) {
      const target = e.currentTarget as HTMLElement;

      if (target) {
        target.classList.toggle("selected");

        if (target.dataset.selected === "true") {
          target.dataset.selected = "false";
          state.markedGroups = state.markedGroups
          .filter(value => value.id != target.dataset.id)
        } else {
          target.dataset.selected = "true";

          state.markedGroups.push(group)
        }
      }
    });

    const nodeBool = document.createElement("span");
    nodeBool.className = "block-bool";
    nodeBool.appendChild(document.createTextNode(group.boolean));

    const nameNode = document.createElement("span");
    nameNode.className = "name";
    nameNode.appendChild(document.createTextNode("Group " + (index + 1)));
    groupNode.appendChild(nameNode)
    
    criteriaContainer.appendChild(nodeBool);
    criteriaContainer.appendChild(groupNode);

    
  }

  function renderCriteria(criteria: Criteria) {

    const node = _createCriteriaNode(criteria);

    _listenClick(node);

    criteria._node = node;

    if (criteria._node) {
      criteriaContainer.appendChild(_createCriteriaBoolNode(criteria));
      criteriaContainer.appendChild(criteria._node);
    }
  }

  function setCriteria(criteria: Criteria) {
    
    if (!state.criterias.some((c) => c.id == criteria.id)) {      
        state.criterias.push(criteria);
    }
    
    update();
  }

  function groupItems() {
    if (state.markedItems.length < 2) {
      return;
    }

    const entries = [...state.markedItems.sort((a, b) => (a.id > b.id ? 1 : -1))]

    state.groups.push({
      id: Date.now(),
      entries,
      boolean: entries[0].boolean
    });

    const markedItemsId = state.markedItems.map((v) => v.id);

    state.criterias = state.criterias.filter(
      (c: Criteria) => !markedItemsId.includes(c.id)
    );

    state.markedItems = [];

    // console.log(groups, state.criterias);

    update();
  }

  function invalidate() {
    // criteriaContainer.innerHTML = ""
    while (criteriaContainer.firstChild !== null) {
      criteriaContainer.removeChild(criteriaContainer.firstChild);
    }
  }

  function update() {
    //TODO destroy all nodes and re-build them or something like that
    invalidate();

    state.groups.forEach((group, groupIndex) => 
      renderCriteriaGroup(group, groupIndex)
    );

    state.criterias.forEach((criteria) => {
      // console.log(criteria)
      renderCriteria(criteria);
    });
  }

  function save() {
    // const results = {
    //     groups: state.groups,
    //     criteria: state.criterias,
    // }
     
    return [...state.groups];
  }

  return {
    setCriteria,
    groupItems,
    update,
    getMarkedItems,
    save
  };
}
