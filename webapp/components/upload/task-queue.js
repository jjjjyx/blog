class Queue {
    constructor (maxThreadNum = 10) {
        // 等待中的队列
        this.waitQueue = []
        // 执行中的任务
        this.currTaskList = []
        this.maxThreadNum = maxThreadNum
    }

    start () {
        if (this.currTaskList.length < this.maxThreadNum) {
            this.startNext()
        } else {
            console.log(`当前执行任务数量已满，max:${this.maxThreadNum},curr:${this.currTaskList.length},任务进入等待队列`)
        }
    }

    stop () {

    }

    getNextTask () {
        if (this.waitQueue.length === 0) {
            console.log('空闲')
            return null
        } else {
            return this.waitQueue.shift()
        }
    }

    startNext () {
        let task = this.getNextTask()

        if (task != null) {
            console.log(`启动下一个任务id:${task.id},剩余任务【${this.waitLength}】个`)
            new Promise((resolve, reject) => {
                this.currTaskList.push(task)
                task.start(resolve, reject)
            }).then(() => {
                let index = this.currTaskList.indexOf(task)
                this.currTaskList.splice(index, 1)
                this.start()
            })
        }
    }

    addTask (task) {
        // let task = new Task()
        if (task != null) {
            // task.onEnd(this.taskCallBack.bind(this));
            this.waitQueue.push(task)
        }

        this.start()
    }

    get waitLength () {
        return this.waitQueue.length
    }
}

let sid = 0

// 任务基类
class Task {
    constructor () {
        this._id = ++sid
        // this.endCall = [];
    }

    start () {
        throw new Error('no task!!')
    }

    get id () {
        return this._id
    }

    set id (value) {
        this._id = value
    }
}

export {
    Queue,
    Task
}
