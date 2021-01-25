import React from "react";
import "./marketing.less";
import "../../common/globalstyle.less";
import { Image, Button, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'



const props = {
  
  
  progress: {
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: percent => `${parseFloat(percent.toFixed(2))}%`,
  },
};
class Marketing extends React.Component {
  state = {
    loading: false,
    loading2: false,
    imageUrl: null,
    imageUrl2: null
  };
  componentDidMount() {
    document.title = "营销海报"
    this.getPoster1();
    this.getPoster2()
  }

  //推广海报
  getPoster1 = () => {
    post(servicePath.selectPostersInfo, {
      'postersType': 1
    })
      .then(response => {
        console.log(response)
        let configValue = response.data.data.configValue
        this.setState({ imageUrl: configValue + '?t=' + new Date().getTime() })
      })
  }
  //招商海报
  getPoster2 = () => {
    post(servicePath.selectPostersInfo, {
      'postersType': 2
    })
      .then(response => {
        console.log(response)
        let configValue = response.data.data.configValue
        this.setState({ imageUrl2: configValue + '?t=' + new Date().getTime() })
      })
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  beforeUpload = (file) => {
    const isJpgOrPng =  file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传png格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图片需小于1M!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = info => {
    console.log(info, 'llllll')
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      message.success(`${info.file.name} 上传成功`)
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };
  handleChange2 = info => {
    console.log(info, 'llllll')
    if (info.file.status === 'uploading') {
      this.setState({ loading2: true });
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      message.success(`${info.file.name} 上传成功`)
      this.getBase64(info.file.originFileObj, imageUrl2 =>
        this.setState({
          imageUrl2,
          loading2: false,
        }),
      );
    }else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  render() {
    const { loading,loading2, imageUrl, imageUrl2 } = this.state;

    return (
      <div className='marketing'>
        <h2 className='headTitle'>营销海报</h2>
        <div className='poster'>

          <div className='investmentPoster'>
            <div className='title'> 招商海报</div>
            <div className='context'>

              <Image
                width={200}
                src={imageUrl}
                alt="招商海报" />
            </div>
            <div className='foot'>
              <Upload
                name="file"
                listType="picture"
                className="file"
                showUploadList={false}
                action={servicePath.uploadPostersUrl}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                data={{ "postersType": 1 }}
                withCredentials={true}
                headers={{
                  "JWT-Token": localStorage.getItem("jwt_token"),
                }}
                method="post"
                {...props}
              >
                <Button type="primary" htmlType="submit" loading={loading}>点击上传</Button>
              </Upload>
            </div>
          </div>

          <div className='promotionPoster'>
            <div className='title'>推广海报</div>
            <div className='context'>

              <Image
                width={200}
                src={imageUrl2}
                alt="招商海报" />
            </div>
            <div className='foot'>
              <Upload
                name="file"
                listType="picture"
                className="file"
                showUploadList={false}
                action={servicePath.uploadPostersUrl}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange2}
                data={{ "postersType": 2 }}
                withCredentials={true}
                headers={{
                  "JWT-Token": localStorage.getItem("jwt_token"),
                }}
                method="post"

              >
                <Button type="primary" htmlType="submit" loading={loading2}>点击上传</Button>
              </Upload>

            </div>
          </div>


        </div>
      </div>
    )
  }
}

export default Marketing;