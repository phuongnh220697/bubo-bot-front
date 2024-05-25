<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Add New Integration</h4>
          </div>
          <div class="card-body">
            <form >
              <div class="mb-3">
                <label for="type" class="form-label"><b>Type</b></label>
                <div class="dropdown w-100">
                  <button
                    class="btn btn-secondary dropdown-toggle form-control-lg w-100 text-start d-flex justify-content-between align-items-center"
                    :class="{ 'invalid': !!getError('type') }"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    :style="{ backgroundColor: '#fff', color: '#000' }"
                  >
                    <span v-if="form.type === 'discord'">
                      <i class="bi bi-discord blue-icon"></i> Discord
                    </span>
                    <span v-else> Select type </span>
                  </button>
                  <ul ref="typeList"
                    class="dropdown-menu w-100"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <a class="dropdown-item" href="#" @click="selectType('')">
                        Select type
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click="selectType('discord')"
                      >
                        <i class="bi bi-discord blue-icon"></i> Discord
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="error"><b>{{ getError('type') }}</b></div>
              </div>
              <div class="mb-3">
                <label for="friendlyName" class="form-label"
                  ><b>Friendly Name</b>&nbsp;<span class="text-danger"
                    >*</span
                  ></label
                >
                <input
                  type="text"
                  id="friendlyName"
                  class="form-control form-control-lg"
                  :class="{ 'invalid': !!getError('friendlyName') }"
                  v-model="form.friendlyName"
                />
                <div class="error"><b>{{ getError('friendlyName') }}</b></div>
              </div>
              <div class="mb-3">
                <label for="webhookURL" class="form-label"
                  ><b>Webhook URL</b>&nbsp;<span class="text-danger"
                    >*</span
                  ></label
                >
                <input
                  type="text"
                  id="webhookURL"
                  class="form-control form-control-lg"
                  :class="{ 'invalid': !!getError('webhookURL') }"
                  v-model="form.webhookURL"
                />
                <div class="error"><b>{{ getError('webhookURL') }}</b></div>
              </div>
              <div class="mb-3">
                <label for="botName" class="form-label"
                  ><b>Bot Display Name</b></label
                >
                <input
                  type="text"
                  id="botName"
                  class="form-control form-control-lg"
                  :class="{ 'invalid': !!getError('botName') }"
                  v-model="form.botName"
                />
                <div class="error"><b>{{ getError('botName') }}</b></div>
              </div>
              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary btn-lg" @click="sendTest">
                  Send Test
                </button>
                <button type="button" class="btn btn-secondary btn-lg"  @click="save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VUE_APP_API_URL } from "../../config"
import { reactive,ref } from "vue";
import { z } from "zod";
import useValidation from '../composables/useValidation';

const validationSchema = z.object({
  type: z.string().min(1, "Please select type"),
  friendlyName: z.string().min(1, "Please enter name"),
  webhookURL: z.string().url("Please enter a valid URL"),
  botName: z.string().optional().default(""),
});

const typeList = ref<HTMLElement>()

const initialState = {
  type: "",
  friendlyName: "My Discord Alert",
  webhookURL: "",
  botName: "",
}

const form = reactive({...initialState});

const { validate, isValid, errors, getError, scrolltoError } = useValidation(validationSchema, form, {
  mode: 'lazy',
});

const selectType = (type: string) => {
  form.type = type;
  typeList.value?.classList.remove('show')
};

const sendTest = async () => {
  // Handle send test
  await validate();

  if (isValid.value) {
    try {
      const response = await fetch(`${VUE_APP_API_URL}/send`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json();
      if(data.errors || data.error) {
        alert('Send to Wedhook failed')
      } else {
        alert('Send to Wedhook done')
        typeList.value?.classList.remove('show')
      }
    } catch(e) {
      alert('Send to Wedhook failed')
    }
  } else {
    scrolltoError('.invalid', { offset: 24 });
  }
 
};

const save = async () => {
  // Handle send test
  await validate();

  if (isValid.value) {
    try {
      const response = await fetch(`${VUE_APP_API_URL}/store`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      if(data.errors || data.error) {
        alert('Save data failed')
      } else {
        alert('Save data done')
        typeList.value?.classList.remove('show')
        console.log(errors.value)

      }
    } catch(e) {
      alert('Save data failed')
    }
    
  } else {
    scrolltoError('.invalid', { offset: 24 });
  }
};
</script>
<style scoped>
.container {
  max-width: 900px;
}

.dropdown-menu {
  font-size: 1rem; /* Set the font size for the dropdown items */
}

.dropdown-toggle {
  font-size: 1rem; /* Set the font size for the dropdown button */
}

.blue-icon {
  color: blue; /* Set the color of the icons to blue*/
}

.error {
  font-size: 14px;
  color: red;
  margin-top: 4px;
}

input.invalid
{
  border: 2px solid red;
}

button.invalid
{
  border: 2px solid red;
}
</style>
