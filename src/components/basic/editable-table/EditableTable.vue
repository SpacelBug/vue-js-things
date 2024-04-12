<template>
  <div id="EditableTable">
    <div class="table-menu">
      <div class="table-menu-buttons">
        <div class="table-menu-button" @click="addNewRow">
          Добавить запись
        </div>
      </div>
    </div>

    <div class="table-header">
      <slot name="header">
        <div v-for="columnParams in headers" class="table-header-cell">
          {{ columnParams.caption }}
          <div v-if="columnParams.hasOwnProperty('subHeaders')" class="table-header-sub-header">
            <div v-for="subHeader in columnParams.subHeaders" class="table-header-sub-header-cell">
              {{ subHeader.caption }}
            </div>
          </div>
        </div>
      </slot>
    </div>

    <div class="table-body">

      <div class="table-new-rows">
        <editable-row
            v-for="(newRow, index) in newRows"
            :row="newRow"
            :headers="headers"
            :text-align="textAlign"
            @cancelChanges="newRows.splice(index, 1)"
        />
      </div>

      <div class="table-rows">
        <template v-for="(row, index) in rows">
          <static-row
              v-if="indexOfUpdatingRow !== index"
              :row="row"
              :headers="headers"
              :text-align="textAlign"
              :background-color="backgroundColor"
              :additional-color="additionalColor"
              @rowClick="indexOfUpdatingRow = index"
          />
          <editable-row
              v-else
              :row="row"
              :headers="headers"
              :text-align="textAlign"
              :background-color="backgroundColor"
              :additional-color="additionalColor"
          />
        </template>
      </div>

    </div>
  </div>
</template>

<script>
import EditableRow from "@/components/basic/editable-table/EditableRow";
import StaticRow from "@/components/basic/editable-table/StaticRow";

export default {
  name: "EditableTable",
  components: {
    EditableRow,
    StaticRow,
  },
  props: {
    rows: {type: Array, require: true},
    headers: {
      require: true,
      validator(value) {
        for (let key in value) {
          console.log(value[key])
          if (
              !(typeof value === 'object') ||
              !value[key].hasOwnProperty('inputType') ||
              !value[key].hasOwnProperty('caption')
          ) {
            return false
          }
        }
        return true
      }
    },

    rowsLimit: {type: Number, default: null},

    textAlign: {type: String, default: 'center'},

    activeColor: {type: String, default: 'lightgrey'},
    backgroundColor: {type: String, default: 'grey'},
    additionalColor: {type: String, default: 'darkgrey'},
    boxShadow: {type: String, default: 'none'},
    border: {type: String, default: 'none'},
  },
  data() { return {
    newRows: [],

    indexOfUpdatingRow: null,
  }},
  methods: {
    addNewRow() {
      let newRow = {}

      for (let key in this.headers) {
        if (this.headers[key].hasOwnProperty('subHeaders')) {
          newRow[key] = {}
          for (let subKey in this.headers[key].subHeaders) {
            newRow[key][subKey] = 'null'
          }
        } else {
          newRow[key] = 'null'
        }
      }

      this.newRows.push(newRow)
    },
  }
}
</script>

<style scoped>
#EditableTable{
  background-color: v-bind(backgroundColor);
  padding: 32px;
}
/***TableMenu***/
.table-menu{
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}
.table-menu-buttons{
  display: flex;
  flex-direction: row;
}
.table-menu-button{
  cursor: pointer;
  user-select: none;
  padding: 8px 16px;
  background-color: v-bind(additionalColor);
}
/***TableHeader***/
.table-header{
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-right: 60px;
}
.table-header-cell{
  text-align: center;
  width: 100%;
  padding: 8px 0;
}
.table-header-sub-header{
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  justify-content: space-between;
}
.table-header-sub-header-cell{
  width: 100%;
  text-align: center;
}
</style>