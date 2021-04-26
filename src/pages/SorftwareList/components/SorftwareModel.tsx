import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, message, Spin, Space, Row, Col, Select, Upload } from 'antd';
import { useRequest } from 'umi'
import FormBuilder from '../build/FormBuilder'
import ActionBuilder from '../build/ActionBuilder'
import moment from 'moment'
import { submintAdaptor, setFildsAdaper } from '../helper'
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { UploadOutlined } from '@ant-design/icons';


//只用来处理添加和修改，不处理删除操作
const SorftwareModel = (props) => {

    const [form] = Form.useForm();

    const { Option } = Select;
    const [files, setFiles] = useState([])
    const [sorftwareTypeTmp, setSorftwareTypeTmp] = useState(-1)
    const layout = {

        labelCol: { span: 1 },
        wrapperCol: { span: 25 },
    };



    //添加和修改为post，没有删除，删除在index中实现
    const request = useRequest(
        (values) => {
            message.loading("SorftwareModel 正在发送请求.....", 1)
            console.log('request发送的参数为：')
            console.log(values)
            return {
                url: `http://localhost:8080/sorftwareList/api${values.url}`,
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
            //如果没有上面的formatResult的化话，只接收返回数据有data的json，加上后data有后端返回的所有数据
            //{"success":true,"message":"Add successfully.","data":[]}
            onSuccess: (data) => {
                console.log("成功时返回：")
                console.log(data)
                //添加成功就关闭
                message.success(data?.data?.message)
                props.handleFinish()
            },
        });





    //得到所有软件类型
    const sorftwareType = useRequest(
        (values) => {
            // message.loading("正在发送请求.....", 1)
            console.log('sorftwareType 发送的参数values为：')
            // console.log(values)
            // const valuesPara = submintAdaptor(values)
            // console.log('sorftwareType 发送的参数valuesPara为：')
            // console.log(valuesPara)
            return {
                url: `http://localhost:8080/typeList/api/getPage?page=1&per_page=999`,
                method: 'get',
                // params: valuesPara,
                // paramsSerializer: (params) => {
                //     return params;
                // }
            }
        }
        , {
            onError: () => {
                console.log('sorftwareType的失败数据为：', sorftwareType)
                // message.error("查询失败", 1)
            },
            onSuccess: () => {
                console.log("获得的类型列表为：", sorftwareType)
            },
        });



    useEffect(() => {
        if (props.visible) {

            console.log('可视化状态发生改变')

            //在弹出对话框之前先清空
            form.resetFields()
            setFiles([])

            //需要根据传入的title区分操作新闻
            if (props.title === '添加') {
                sorftwareType.run()

            } else if (props.title === '编辑') {
                //当进行编辑操作的时候，如果发现init.data有变化了，那就要把值添加到form表单中
                console.log('编辑前：', props.record)
                props.record.content = BraftEditor.createEditorState(props.record.content)
                props.record.filesObject = JSON.parse(props.record.files)
                console.log('编辑后：', props.record)

                form.setFieldsValue(props.record);
                setFiles(props.record.filesObject)
                setSorftwareTypeTmp(props.record.sorftwareType.id)
            }

        }
    }, [props.visible])









    //点击提交
    const onFinish = (values) => {

        values.content = (values.content.toHTML())

        console.log('提交前的values:', values)

        const filesName = files.map((file) => {
            return file.name
        })
        values.files = filesName

        //设置软件类型,如果是修改values.sorftwareType不会为空，此时要设置id,否则就是添加，此时不需要id
        if(values.sorftwareType!==undefined){
            values.name = values.sorftwareType.id
        }
        

        values.name = sorftwareTypeTmp
        console.log('values,', values)
        //表单中的数据都在values中
        request.run(values)
    };




    return (

        <Spin className="example" spinning={props.visible}>
            <Modal
                //点击周围不会自动关闭
                maskClosable={false}
                width="1000px"
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
                        key='title'
                        label='标题'
                        name='title'
                    >
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        key='name'
                        label='类型'
                        name='name'
                    >
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="请选择类型"
                            optionFilterProp="children"
                            onChange={(e) => {
                                console.log('选择发生了变化：', e)
                                setSorftwareTypeTmp(e)
                            }}
                            onFocus={() => { }}
                            onBlur={() => { }}
                            onSearch={() => { }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {(sorftwareType?.data?.datasource || []).map((item) => {
                                return <Option key={item.id} value={item.id}>{item.name}</Option>
                            })}

                        </Select>
                    </Form.Item>


                    <Upload
                        name='multipartFile'
                        multiple={true}
                        action={'http://localhost:8080/sorftwareList/api/uploadFile'}
                        // defaultFileList={this.state.filesObject}
                        fileList={files}
                        beforeUpload={(info) => {
                            // console.log("上床前", info)

                            const isExit = true;

                            files.forEach((item) => {
                                if (item.name === info.name) {
                                    console.log("执行了")
                                    message.error('文件已经存在，请删除后重试');
                                    isExit = false;
                                }
                            })
                            console.log("结束:")
                            console.log("isExit:", isExit)
                            return isExit;
                        }}

                        onChange={(info) => {

                            const { status } = info.file;
                            console.log("status:", status)

                            if (status === 'uploading') {
                                console.log('uploading')

                                setFiles(info.fileList)
                            }
                            if (status === 'done') {
                                console.log('done')
                                message.success(`${info.file.name} 文件上传成功.`);

                                console.log("当前上传的文件：", info.fileList)

                            } else if (status === 'error') {
                                console.log('error')
                                message.error(`${info.file.name} 文件上传失败,文件大小不能超过10M，请压缩后再上传`);
                            }
                            else if (status === 'removed') {
                                console.log('removed')
                                setFiles(info.fileList)
                            }
                        }}
                    >
                        <Button icon={<UploadOutlined />}>点击上传</Button>
                    </Upload>



                    <Form.Item
                        key='content'
                        // label='内容'
                        name='content'
                        rules={[{ required: true, message: '请输入内容' }]}
                    >
                        {/* <Input style={{ width: '100%' }} /> */}
                        <BraftEditor style={{ width: '100%' }} />
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


                        <Col>
                            <Form.Item
                                name='files'
                                key='files'
                            >
                                <Input hidden={true} value={files} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                name='sorftwareType'
                                key='sorftwareType'
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

export default SorftwareModel