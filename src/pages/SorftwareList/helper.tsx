import moment from 'moment'


//这里会根据init.data.layout.tabs下data中记录的类型(找key)，然后记录，之后来对init.data.dataSource中的数据类型进行适配
export const setFildsAdaper = (data) => {

    if (data?.layout?.tabs && data?.dataSource) {


        //需要返回的，处理好的数据
        const result = {}

        data.layout.tabs.forEach((tab) => {
            tab.data.forEach((field) => {
                if (field.type === 'datetime') {

                    result[field.key] = moment(data.dataSource[field.key])
                } else {
                    result[field.key] = data.dataSource[field.key]
                }
                //如果还有其他类型需要单独处理在这里添加else if就可以了
            })
        })

        return result;
    } else {
        return {};
    }

}







//对时间类型对象进行特殊处理(输入的是一个对象)
export const submintAdaptor = (formValues) => {

    const result = {}

    if(formValues===undefined){
        return {}
    }

    //对象所有属性循环(有可能对象的属性有数组类型，这个是否需要判断数组类型里面的每一项是不是时间类型)
    Object.keys(formValues).forEach((key) => {

        //对于时间类型，如果输入后又清空了，那就会变为null，之后在对时间数组扁平化处理后，传入对参数会传入空值
        if(formValues[key]===null){
            result[key] = undefined;
        }else{
            result[key] = formValues[key]
        }

        

        //如果某个属性是时间类型，就转化为字符串类型
        if (moment.isMoment(formValues[key])) {
            result[key]  = (formValues[key]).format()
        }

        //如果某个属性是数组类型，就判断内部有没有时间类型
        if(Array.isArray(result[key])){
         
            result[key] = result[key].map((innerValue)=>{
                if (moment.isMoment(innerValue)) {
                    return moment(innerValue).format()
                }else{
                    return innerValue
                }  
            }) 
        } 
    })

    
    return result
}





//对一个数组，数组中有时间对部分进行处理，输入是一个数组
export const arrAdaptor = (formValues) => {
   
    const result =[]

    if(!formValues){
        return undefined;
    }

    (formValues || []).map((item)=>{
        item.create_time =moment(item.create_time).format("YYYY-MM-DD")

        //对软件列表而已，需要吧软件类型给提上来
        item.name = item.sorftwareType?.name
        
        result.push(item)


    })
    return result
}







