let eventBus = new Vue()

Vue.component("Notes", {
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

    mounted() {
        if (localStorage.getItem('allColumns')) {
          try {
            this.allColumns = JSON.parse(localStorage.getItem('allColumns'));
            [this.column1, this.column2, this.column3, this.blockOne] = this.allColumns;
          } catch (e) {
            localStorage.removeItem('allColumns');
          }
        }
    },
    watch:{
        column1(){
            this.allColumns = [this.column1,this.column2,this.column3, this.blockOne]
            const parsed = JSON.stringify(this.allColumns);
            localStorage.setItem('allColumns', parsed);
        },
        column2(){
            allColumns = [this.column1, this.column2, this.column3, this.blockOne]
            const parsed = JSON.stringify(this.allColumns);
            localStorage.setItem('allColumns', parsed);
        },
        column3(){
            allColumns = [this.column1, this.column2, this.column3, this.blockOne]
            const parsed = JSON.stringify(this.allColumns);
            localStorage.setItem('allColumns', parsed);
        },
    }, 

    methods:{
        onSubmit() {
            this.errors = [];
            this.points = [];
        
            const addPoint = (point) => {
                if (point) {
                this.points.push([point, false]);
                }
            };
        
            addPoint(this.point1);
            addPoint(this.point2);
            addPoint(this.point3);
            addPoint(this.point4);
            addPoint(this.point5);
        
            if (this.points.length < 3) {
                this.errors.push("Должно быть заполнено минимум 3 пункта");
            }
            if (!this.name) {
                this.errors.push("Введите заголовок");
            }
            if  (this.column1.length >= 3) {
                this.errors.push("Достигнуто максимальное число карточек");
            }
            if (this.blockOne) {
                this.errors.push("Второй столбец переполнен");
            }
        
            if (this.errors.length === 0) {
                const info = {
                name: this.name,
                points: this.points,
                card_id: this.card_id,
                count_of_checked: 0,
                };
                this.card_id += 1;
                this.column1.push(info);
            }
        },

        toColumnOne(name, points, card_id, count_of_checked) {
            if (this.column1.length < 3) {
              const info = {
                name: name,
                points: points,
                card_id: card_id,
                count_of_checked: count_of_checked,
                };
          
            for (let i = 0; i < this.column2.length; i++) {
                if (this.column2[i].card_id == card_id) {
                    this.column2.splice(i, 1);
                    break;
                }
            }
          
            this.column1.push(info);
            }
        },
  
        toColumnTwo(name, points, card_id, count_of_checked) {
            if (this.column2.length === 5) {
                this.blockOne = true;
            } else {
            const info = {
                name: name,
                points: points,
                card_id: card_id,
                count_of_checked: count_of_checked,
            };
          
            for (let i = 0; i < this.column1.length; i++) {
                if (this.column1[i].card_id == card_id) {
                  this.column1.splice(i, 1);
                  break;
                }
            }
          
            this.column2.push(info);
            }
          
            let checks = 1;
            eventBus.$emit('checkTwo', checks);
        },
  
        toColumnThree(name, points, card_id, now) {
            const info = {
              name: name,
              points: points,
              card_id: card_id,
              dat: now,
            };
          
            for (let i = 0; i < this.column2.length; i++) {
              if (this.column2[i].card_id == card_id) {
                this.column2.splice(i, 1);
                break;
              }
            }
          
            this.column3.push(info);
            this.blockOne = false;
          
            let checks = 1;
            eventBus.$emit('checkOne', checks);
        },
    }
});

Vue.component("card", {
    template: `
      <div class="card">
        <h3>{{name}}</h3>
          <ul>
            <li v-for="point in points"><task :block="block" :point="point[0]" :pblock="pblock" :done="point[1]" @checked="updatechecked" @updatetwo="updatetwo"></task></li>
          </ul>
        <p>{{dat}}</p>
      </div>
    `,
    data() {
        return {
        }
    },

    methods: {
        updatechecked(point) {
        this.count_of_checked+=1;

        for(i in this.points){
            if(this.points[i][0]==point && this.points[i][1] != true){
                this.points[i][1] = true
                break
            }
        }    
        if ((this.count_of_tasks) == (this.count_of_checked)){
        var now = new Date() 
        now = String(now);
        console.log(this.name,this.points,this.card_id,now)
        this.$emit("to-three",this.name,this.points,this.card_id,now);
        }
        else if ((this.count_of_tasks/2) <= (this.count_of_checked)){
        this.$emit("to-two",this.name,this.points,this.card_id, this.count_of_checked);
        }
    },
    updatetwo(point){
        this.count_of_checked-=1;
        if(this.column==2 || this.column==1){
            for(i in this.points){
                if(this.points[i][0]==point && this.points[i][1] == true){
                    this.points[i][1] = false
                    break
                }
            }
            if(this.column==2){
                if ((this.count_of_tasks/2) > (this.count_of_checked)){
                    this.$emit("to-one",this.name,this.points,this.card_id, this.count_of_checked);

                    }
            }           
        }
    }
    },
    mounted() {
        eventBus.$on('checkOne',checks => {
            this.count_of_checked = 0
            for(i in this.points){
                if(this.points[i][1] == true){
                    this.count_of_checked += 1
                }
            }    
            
            if ((this.count_of_tasks/2) <= (this.count_of_checked) && (this.count_of_tasks) != (this.count_of_checked)){
            this.$emit("to-two",this.name,this.points,this.card_id, this.count_of_checked);
        }
            
        })
        eventBus.$on('checkTwo',checks => {
            this.count_of_checked = 0
            for(i in this.points){
                if(this.points[i][1] == true){
                    this.count_of_checked += 1
                }
            }    
            
            if ((this.count_of_tasks/2) > (this.count_of_checked)){
            this.$emit("to-one",this.name,this.points,this.card_id, this.count_of_checked);
        }
            
        })
    },
});


let app = new Vue({
    el: "#app",
    data: {
    },
    methods: {

    },
});