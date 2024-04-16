<template>
  <div id="EditableTable">
    <div class="table-menu">
      <div class="table-menu-buttons">
        <div v-if="newRows.length > 0 || indexOfUpdatingRow !== null" class="submit-icon" @click="saveAll"/>
        <div v-if="newRows.length > 0 || indexOfUpdatingRow !== null" class="cross-icon" @click="newRows = []"/>
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
        <transition-group name="fade-down" appear>
          <editable-row
              v-for="(newRow, index) in newRows"
              :model-value="newRow"
              :headers="headers"
              :text-align="textAlign"
              :key="newRow"
              @update:modelValue="(row)=>{newRows[index] = newRow}"
              @submitClick="saveNewRow"
          />
        </transition-group>
      </div>


      <div class="table-rows">
        <transition-group name="fade" appear>
          <template v-for="(row, index) in rows" :key="index">
            <template v-if="index < rowsLimit">
              <static-row
                  v-if="indexOfUpdatingRow !== index"
                  :row="row"
                  :headers="headers"
                  :text-align="textAlign"
                  :background-color="backgroundColor"
                  :additional-color="additionalColor"
                  @rowClick="indexOfUpdatingRow = index"
                  @changeRowClick="indexOfUpdatingRow = index"
                  @deleteRowClick="$emit('deleteRow', index)"
              />
              <editable-row
                  v-else
                  :model-value="row"
                  :headers="headers"
                  :text-align="textAlign"
                  :background-color="backgroundColor"
                  :additional-color="additionalColor"
                  @update:modelValue="(row)=>{rows[index] = row}"
                  @cancelClick="indexOfUpdatingRow = null"
                  @submitClick="(changedRow)=>submitRowChanges(changedRow, index)"
              />
            </template>
          </template>
        </transition-group>
        <div
            v-if="rows.length > rowsLimit"
            class="show-more-button"
            @click="rowsLimit += rowsLimitStep"
        >
            Показать еще
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import EditableRow from "@/components/basic/editable-table/EditableRow";
import StaticRow from "@/components/basic/editable-table/StaticRow";

export default {
  name: "EditableTable",
  emits: ['submitAll', 'submitRowChanges', 'deleteRow', 'saveNewRow'],
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

    rowsLimit: {type: Number, default: 20},
    rowsLimitStep: {type: Number, default: 10},

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
    keysIsEmpty(object) {
      let flag = true

      if (!Array.isArray(object)) {

        for (let key in object) {
          if (object[key] !== null) {
            if (typeof object[key] === 'object') {
              flag = this.keysIsEmpty(object[key])
            } else {
              return false
            }
          }
        }

      } else {

        for (let elem of object) {
          if (elem !== null) {
            if (typeof elem === 'object') {
              flag = this.keysIsEmpty(elem)
            } else {
              return false
            }
          }
        }

      }

      return flag
    },
    addNewRow() {
      let newRow = {}

      for (let key in this.headers) {
        if (this.headers[key].hasOwnProperty('subHeaders')) {
          newRow[key] = {}
          for (let subKey in this.headers[key].subHeaders) {
            newRow[key][subKey] = null
          }
        } else {
          newRow[key] = null
        }
      }

      this.newRows.push(newRow)
    },
    saveNewRow(row, index) {
      try {
        if (!this.keysIsEmpty(row)) {
          this.$emit('saveNewRow', row)
          this.newRows.splice(index, 1)
        } else {
          console.debug('Cant set new row. Have no values')
          throw 'Have no values'
        }
      } catch (error) {
        console.debug(error)
        throw error
      }
    },
    saveAll() {
      while (this.newRows.length > 0) {
        let index = this.newRows.length - 1
        try {
          this.saveNewRow(this.newRows[index], index)
        } catch (error) {
          console.debug(error)
          break
        }
      }

      if (this.indexOfUpdatingRow) {
        this.submitRowChanges(this.rows[this.indexOfUpdatingRow], this.indexOfUpdatingRow)
      }
    },
    submitRowChanges(row, index) {
      try {
        if (!this.keysIsEmpty(row)) {
          this.$emit('submitRowChanges', row, index)
          this.indexOfUpdatingRow = null
        } else {
          console.debug('Cant update row. Have no values')
        }
      } catch (error) {
        console.debug(error)
        throw error
      }
    }
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
  align-items: center;
  gap: 16px;
}
.table-menu-button{
  cursor: pointer;
  user-select: none;
  padding: 8px 16px;
  background-color: v-bind(additionalColor);
  white-space: nowrap;
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
.table-body{
  position: relative;
}
.show-more-button{
  background-color: v-bind(additionalColor);
  margin: 0 auto;
  padding: 8px 16px;
  width: fit-content;
}
/***Icons***/
.submit-icon{
  cursor: pointer;
  background-color: white;
  width: 25px;
  height: 25px;
  aspect-ratio: 1/1;
  mask-image: url("submit.svg");
  mask-size: contain;
}
.cross-icon{
  cursor: pointer;
  background-color: white;
  width: 25px;
  height: 25px;
  aspect-ratio: 1/1;
  mask-image: url("cross.svg");
  mask-size: contain;
}
/***Animations***/
.fade-down-move{
  transition: all 0.3s ease;
}
.fade-down-enter-from{
  opacity: 0;
  transform: translateY(-30px);
}
.fade-down-enter-active{
  transition: all 0.3s ease;
}
.fade-down-enter-to{
  opacity: 1;
}
.fade-down-leave-from{
  opacity: 1;
}
.fade-down-leave-active{
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
}
.fade-down-leave-to{
  opacity: 0;
  transform: translateX(-30px);
}

.fade-move{
  transition: all 0.3s ease;
}
.fade-enter-from{
  opacity: 0;
}
.fade-enter-active{
  transition: all 0.3s ease;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-active{
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
}
.fade-leave-to{
  opacity: 0;
}
</style>