import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, message, Spin, Space, Row, Col } from 'antd';
import { useRequest } from 'umi'
import FormBuilder from '../build/FormBuilder'
import ActionBuilder from '../build/ActionBuilder'
import moment from 'moment'
import { submintAdaptor, setFildsAdaper } from '../helper'
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'


//只用来处理添加和修改，不处理删除操作
const TagModel = (props) => {

    const [form] = Form.useForm();

    const layout = {

        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };



    //添加和修改为post，没有删除，删除在index中实现
    const request = useRequest(
        (values) => {
            message.loading("TyperModel 正在发送请求.....", 1)
            console.log('request发送的参数为：')
            console.log(values)
            return {
                url: `http://localhost:8080/typeList/api${values.url}`,
                method: 'post',
                data: {
                    ...submintAdaptor(values),
                },
            }
        }
        , {
            manual: true,
            onError: (data) => {
               
            },
            //得到后端成功返回全部数据(需要添加这个)
            formatResult: (res) => {
                return res
            },

            onSuccess: (data) => {
                console.log("成功时返回：")
                console.log(data)
                //添加成功就关闭
                message.success(data?.data?.message)
                props.handleFinish()
            },
        });




    useEffect(() => {
        if (props.visible) {

            console.log('可视化状态发生改变')

            //在弹出对话框之前先清空
            form.resetFields()


            //需要根据传入的title区分操作新闻
            if (props.title === '添加') {
                //添加默认显示空窗口即可
            } else if (props.title === '编辑') {
                //当进行编辑操作的时候，如果发现init.data有变化了，那就要把值添加到form表单中

                form.setFieldsValue(props.record);
            }
        }
    }, [props.visible])





    //点击提交
    const onFinish = (values) => {

        //表单中的数据都在values中
        request.run(values)
    };





    return (


        <Spin className="example" spinning={props.visible}>

            <Modal
                //点击周围不会自动关闭
                maskClosable={false}
                width="500px"
                title={props.title}
                visible={props.visible}
                onOk={() => {
                    form.submit()
                }}
                onCancel={props.handleCancel}
                forceRender
                footer={

                    <Space>
                        <Button
                            type='primary'
                            onClick={(e) => {
                                form.setFieldsValue({ url: props.modelUrl, method: props.mothod })
                                form.submit()
                            }}
                            loading={request.loading || false}
                        >{props.title}</Button>

                        <Button
                            type='default'
                            onClick={(e) => {

                                props.handleCancel()
                            }}
                        >取消</Button>
                    </Space>
                }
            >

                <Form
                    initialValues={{ create_time: moment(), update_time: moment(), status: true }}
                    form={form}
                    name="basic"
                    {...layout}
                    onFinish={onFinish}
                    onFinishFailed={() => {
                        message.error('提交失败');
                    }}
                >


                    <Form.Item
                        key='name'
                        label='名称'
                        name='name'    
                    >
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                  

                    {/* 隐藏属性 */}
                    <Row>
                        <Col>
                            <Form.Item
                                key='url'
                                name='url'
                            >
                                <Input hidden={true} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                name='method'
                                key='method'
                            >
                                <Input hidden={true} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                name='id'
                                key='id'
                            >
                                <Input hidden={true} />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>

            </Modal>
        </Spin>


    )
}

export default TagModel