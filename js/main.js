let eventBus = new Vue()

Vue.component("board", {
    template: `
          <div class="board">
            <ul id="columns">
            <div class="form">
              <form @submit.prevent="onSubmit">
                <label for="name">Заголовок</label> <input type="text" id="name" v-model="name"> 
                <label for="point1">Пункт1</label> <input type="text" id="point1" v-model="point1"> 
                <label for="point2">Пункт2</label> <input type="text" id="point2" v-model="point2"> 
                <label for="point3">Пункт3</label> <input type="text" id="point3" v-model="point3"> 
                <label for="point4">Пункт4</label> <input type="text" id="point4" v-model="point4"> 
                <label for="point5">Пункт5</label> <input type="text" id="point5" v-model="point5">
                <ul>
                  <li class="error" v-for="error in errors">{{error}}</li>
                </ul>
                <button type="submit" value="Submit">Создать</button>
              </form>
            </div>
              <li class="column">
                <div>
                  <ul class="cards">
                    <li v-for="card in column1">
                      <card :name="card.name" :column=1 :block="blockOne" :card_id="card.card_id" :count_of_checked="card.count_of_checked" :points="card.points" @to-two="toColumnTwo"></card>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="column">
                <ul>
                  <li v-for="card in column2">
                    <card :name="card.name" :column=2 :block=false :card_id="card.card_id" :count_of_checked="card.count_of_checked" :points="card.points" @to-three="toColumnThree" @to-one="toColumnOne"></card>
                  </li>
                </ul>
              </li>
              <li class="column">
                <ul>
                  <li v-for="card in column3">
                    <card class="done_card" :name="card.name" :pblock=true :dat="card.dat" :column=3 :points="card.points"></card>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
    `,
    data() {
        return{
            column1:[],
            column2:[],
            column3:[],

            allColumns:[],
            cards:[],

            name:null,
            point1:null,
            point2:null,
            point3:null,
            point4:null,
            point5:null,
            
            points:[],
            errors:[],
            card_id:0,
            blockOne:false,
        }
    },
});