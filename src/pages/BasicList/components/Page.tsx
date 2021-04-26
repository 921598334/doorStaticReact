// import React, { useState, useEffect } from 'react'
// import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
// import { Row, Col, Tag, Card, Table, Space, Button, Pagination, message, Modal, Form, Tabs, Input, Spin } from 'antd';
// import styles from './index.less'
// import { useRequest, history, useLocation } from 'umi'
// import ColBuilder from './build/ColBuilder'
// import ActionBuilder from '../build/ActionBuilder'
// import UserModel from './components/UserModel'
// import { ExclamationCircleOutlined } from '@ant-design/icons';
// import FormBuilder from '../build/FormBuilder'
// import moment from 'moment'
// import { submintAdaptor, setFildsAdaper } from '../helper'


// const Page = (props) => {

//     const [form] = Form.useForm();

//     //获取当前的url路径
//     const location = useLocation();


//     const { TabPane } = Tabs;

//     const layout = {
//         labelCol: { span: 6 },
//         wrapperCol: { span: 16 },
//     };


//     //默认get请求
//     const init = useRequest(`https://public-api-v2.aspirantzhang.com${location.pathname.replace('/basic-list', '')}?X-API-KEY=antd`, {
//         onError: () => {
//             console.log('发现错误，跳转也面')
//             message.error('页面不存在')
//             history.goBack()
//         },
//         onSuccess: () => {
//             console.log('成功')
//         }
//     });



//     const request = useRequest(
//         (values) => {
//             message.loading("正在发送请求.....")
//             console.log('request发送的参数为：')
//             console.log(values)
//             return {
//                 url: `https://public-api-v2.aspirantzhang.com${values.url}`,
//                 method: values.method,
//                 data: {
//                     ...submintAdaptor(values),
//                     'X-API-KEY': 'antd',
//                 },
//             }
//         }
//         , {
//             manual: true,
//             onError: () => {

//             },
//             //得到后端成功返回全部数据(需要添加这个)
//             formatResult: (res) => {
//                 return res
//             },
//             //如果没有上面的formatResult的化话，只接收返回数据有data的json，加上后data有后端返回的所有数据
//             //{"success":true,"message":"Add successfully.","data":[]}
//             onSuccess: (data) => {
//                 console.log("成功时返回：")
//                 console.log(data)
//                 //添加成功就关闭
//                 message.success(data.message)
//                 history.goBack()
//             },

//         });






//     //监听编辑请求的返回数据,然后自动填充表单
//     useEffect(() => {
//         //发现有返回数据时，开始设置form
//         if (init.data) {

//             console.log("请求的返回:")
//             console.log(init.data.dataSource)

//             //也可以写个适配器来匹配类型（只能设置value，但是对switch这种控件不生效）
//             form.setFieldsValue(setFildsAdaper(init.data));

//         }

//     }, [init.data])




//     //点击提交
//     const onFinish = (values) => {
//         //表单中的数据都在values中
//         request.run(values)
//     };




//     const actionHandel = (action) => {
//         //1.出发表单提交动作
//         //2.得到表单提交参数
//         //3.发送到后端
//         console.log('点击了：')
//         console.log(action)

//         switch (action.action) {
//             case 'submit':

//                 form.setFieldsValue({ url: action.uri, method: action.method })
//                 form.submit()
//                 break;

//             case 'cancel':

//                 history.goBack()

//                 break;

//             case 'reset':

//                 form.resetFields()

//                 break;
//             default:
//                 break;
//         }

//     }


//     return (
//         <PageContainer>

//             <Spin spinning={init.loading}>

//             <Form
//                 initialValues={{ create_time: moment(), update_time: moment(), status: true }}
//                 form={form}
//                 name="basic"
//                 {...layout}
//                 onFinish={onFinish}
//                 onFinishFailed={() => {
//                     message.error('提交失败');
//                 }}
//             >



//                 {/* row sm一共32 */}
//                 <Row gutter={24}>

//                     <Col sm={16}>
//                         <Tabs defaultActiveKey="1"
//                             onChange={() => {

//                             }}
//                             type='card'
//                         >

//                             {(init.data?.layout?.tabs || []).map((item) => {
//                                 return (
//                                     <TabPane tab={item.title} key={item.title}>
//                                         <Card>{FormBuilder(item.data)}</Card>
//                                     </TabPane>
//                                 )
//                             })}

//                         </Tabs>

//                     </Col>
//                     <Col sm={8}>

//                         {(init.data?.layout?.actions || []).map((item) => {
//                             return (
//                                 <Card><Space>{ActionBuilder(item.data, actionHandel)}</Space></Card>
//                             )
//                         })}


//                     </Col>

//                     <Form.Item
//                         key='url'
//                         name='url'
//                     >
//                         <Input hidden={true} />
//                     </Form.Item>

//                     <Form.Item
//                         name='method'
//                         key='method'
//                     >
//                         <Input hidden={true} />
//                     </Form.Item>
//                 </Row>




//                 <FooterToolbar><Space>{ActionBuilder(init.data?.layout?.actions[0].data, actionHandel)}</Space></FooterToolbar>

//             </Form>



//             </Spin>


//         </PageContainer>

//     )
// }

// export default Page