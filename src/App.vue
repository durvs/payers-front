<template>
  <div class="antialiased sans-serif bg-gray-200 h-screen">
    <navigation />
    <div class="container mx-auto">
      <main>
        <div class="container mx-auto py-6 px-4">
          <h1 class="text-3xl py-4 border-b mb-10">Consulta débitos</h1>

          <search :headings="headings" />

          <div
            class="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative"
            style="height: 405px"
          >
            <table
              class="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative"
            >
              <thead>
                <tr class="text-left">
                  <th
                    class="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100"
                  >
                    <label
                      class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                    >
                    </label>
                  </th>

                  <th
                    v-for="heading in headings"
                    :key="heading.key"
                    class="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs"
                    :v-ref="heading.key"
                    :class="{ [heading.key]: true }"
                    v-text="heading.value"
                  ></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payer in payers" :key="payer._id">
                  <td class="border-dashed border-t border-gray-200 px-3">
                    <label
                      class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        class="form-checkbox rowCheckbox focus:outline-none focus:shadow-outline"
                        :name="payer._id"
                        @click="getRowDetail($event, payer._id)"
                      />
                    </label>
                  </td>
                  <td class="border-dashed border-t border-gray-200 id">
                    <span
                      class="text-gray-700 px-6 py-3 flex items-center"
                      v-text="payer.doc.name"
                    ></span>
                  </td>
                  <td class="border-dashed border-t border-gray-200 firstName">
                    <span
                      class="text-gray-700 px-6 py-3 flex items-center"
                      v-text="payer.doc.documentNr"
                    >
                    </span>
                  </td>
                  <td
                    class="border-dashed border-t border-gray-200 lastName flex"
                  >
                    <span
                      class="text-gray-700 px-6 py-3 flex items-center"
                      v-text="formatPrice(payer.total)"
                    ></span>
                  </td>
                  <td>
                    <span
                      class="text-gray-700 px-6 py-3 flex items-center"
                      v-text="formatDate(payer.since)"
                    ></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Search from './components/Search/index.vue';
import Navigation from './components/Navigation/Index.vue';

export default {
  name: 'App',
  components: {
    Search,
    Navigation,
  },
  data() {
    return {
      headings: [
        {
          key: 'name',
          value: 'Nome',
        },
        {
          key: 'documentNr',
          value: 'RG/CPF',
        },
        {
          key: 'value',
          value: 'Valor total',
        },
        {
          key: 'since',
          value: 'Data débito',
        },
      ],
      selectedRows: [],
      open: false,
      payers: [],
    };
  },
  created() {
    this.getPayers();
  },
  methods: {
    async getPayers() {
      const response = await this.$http.get('/payer');
      this.payers = response.data;
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString('pt-BR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    },
    formatPrice(value) {
      const val = (value / 1).toFixed(2).replace('.', ',');
      return `R$ ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    },
    toggleColumn(key) {
      const columns = document.querySelectorAll(`.${key}`);

      if (
        this.$refs[key].classList.contains('hidden') &&
        this.$refs[key].classList.contains(key)
      ) {
        columns.forEach((column) => {
          column.classList.remove('hidden');
        });
      } else {
        columns.forEach((column) => {
          column.classList.add('hidden');
        });
      }
    },
    getRowDetail($event, id) {
      const rows = this.selectedRows;

      if (rows.includes(id)) {
        const index = rows.indexOf(id);
        rows.splice(index, 1);
      } else {
        rows.push(id);
      }
    },
  },
};
</script>

<style>
[type='checkbox'] {
  box-sizing: border-box;
  padding: 0;
}

.form-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex-shrink: 0;
  color: currentColor;
  background-color: #fff;
  border-color: #e2e8f0;
  border-width: 1px;
  border-radius: 0.25rem;
  height: 1.2em;
  width: 1.2em;
}

.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
