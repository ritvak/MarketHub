import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, theme, List, Input, Tooltip } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Moment from 'react-moment';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import APIUtils from '../../helpers/APIUtils';
import './chat.css';
import { handleChatChange, handleOnlineUser } from '../../redux/actions/chatActions';
import UploadModal from './uploadModal';
import ImageModal from './imageModal';
import Payment from '../../shared/payment';
import GlobalHeader from '../../shared/header';
import Loader from '../../shared/loader';

const { Content } = Layout;

const api = msg => new APIUtils(msg);

const Chat = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dispatch = useDispatch();
  const location = useLocation();
  const messagesContainerRef = useRef(null);
  const { selectedChat, chatList } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  const [loading, setLoading] = useState(false);
  const [validator, setValidator] = useSimpleReactValidator();
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [listenNewMessage, setListener] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [previewedImage, setPreviewedImage] = useState('');

  const handleModal = bool => {
    setIsModal(bool);
  };

  const handlePreview = bool => {
    setIsPreview(bool);
  };

  const handleFileData = fileData => {
    setFileList(fileData);
  };

  const handleIsImage = bool => {
    setIsImage(bool);
  };

  const handleImageUrls = (imageData, isReset) => {
    if (!isReset) setImageUrls(prevUrls => [...prevUrls, imageData]);
    else setImageUrls(imageData);
  };

  const handleSubmit = async () => {
    try {
      if (fileList.length > 0) {
        const [recipient] = chatList.filter(cur => cur.key === selectedChat.key);
        await Promise.all(
          fileList.map(async (e, index) => {
            const data = {
              chatId: selectedChat.key,
              senderId: user,
              content: imageUrls[index],
              mimeType: e.type,
              fileName: e.name,
              isImage: isImage,
              isPayment: false,
              recipientId: recipient?.id,
            };

            if (socket === null) return;

            socket.emit('sendMessage', { content: data });
            setListener(!listenNewMessage);
            setMessage('');

            await api().sendMessage(data);
          })
        );
        handleFileData([]);
        handleIsImage(false);
        handleImageUrls([], true);
        await getMessages();
      } else if (validator.allValid()) {
        const [recipient] = chatList.filter(cur => cur.key === selectedChat.key);
        const data = {
          chatId: selectedChat.key,
          senderId: user,
          content: message,
          isImage: isImage,
          isPayment: false,
          recipientId: recipient?.id,
        };

        if (socket === null) return;

        socket.emit('sendMessage', { content: data });
        setListener(!listenNewMessage);
        setMessage('');

        await api().sendMessage(data);
        await getMessages();
      } else {
        validator.getErrorMessages();
        setValidator(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getMessages = async () => {
    try {
      setLoading(true);
      let tempKey = {};
      if (!selectedChat?.key) {
        tempKey = chatList.find(cur => cur.key === location.pathname.split('/chats/')[1]);
        console.log('tempKey', tempKey);
        await dispatch(handleChatChange(tempKey ? tempKey : {}));
      }
      const data = {
        chatId: !selectedChat?.key ? tempKey.key : selectedChat.key,
      };

      const res = await api().getAllMessages(data);

      setAllMessages(res.data.content);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const updateOnlineStatus = async onlineUsers => {
    await dispatch(handleOnlineUser(onlineUsers));
  };

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // add online users
  useEffect(() => {
    (async () => {
      if (socket === null) return;
      socket.emit('addNewUser', user);
      socket.on('getOnlineUsers', res => {
        updateOnlineStatus(res);
      });
      socket.on('paymentSuccessful', res => {
        socket.emit('paymentSuccessful', res);
      });

      return () => {
        socket.off('getOnlineUsers');
      };
    })();
  }, [socket]);

  // receive message
  useEffect(() => {
    if (socket === null) return;

    const handleMessageReceived = res => {
      if (selectedChat.key !== res.content.chatId) return;
      setAllMessages(prev => [...prev, res.content]);
    };

    socket.on('getMessage', handleMessageReceived);

    return () => {
      socket.off('getMessage', handleMessageReceived);
    };
  }, [socket, selectedChat.key, listenNewMessage]);

  useEffect(() => {
    (async () => {
      await getMessages();
    })();
  }, [user, selectedChat.key]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    const messagesContainer = messagesContainerRef.current;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [allMessages]);

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      <GlobalHeader title={`${selectedChat?.label}`} />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        {loading && <Loader />}
        <div
          className="chat-container"
          style={{
            background: colorBgContainer,
          }}
          ref={messagesContainerRef}
        >
          <List
            dataSource={allMessages}
            renderItem={item => (
              <List.Item
                className={
                  item.isPayment ? 'paymentText' : item.senderId === user ? 'textRight' : ''
                }
              >
                {item.isImage ? (
                  <div className="image-container">
                    <img
                      src={item.content}
                      alt="Image"
                      role="presentation"
                      onClick={() => {
                        setPreviewedImage(item.content);
                        handlePreview(true);
                      }}
                    />
                    <div className={item.senderId === user ? 'message-time-right' : 'message-time'}>
                      <Moment format="YYYY/MM/DD hh:mm A">{item.createdAt}</Moment>
                    </div>
                  </div>
                ) : (
                  <div className="message-container">
                    <div className="message-content">{item.content}</div>
                    <div className="message-time">
                      <Moment format="YYYY/MM/DD hh:mm A">{item.createdAt}</Moment>
                    </div>
                  </div>
                )}
              </List.Item>
            )}
          />
        </div>
        <div className="chat-input">
          <Input
            placeholder="Type a message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onPressEnter={handleSubmit}
            style={{ marginRight: '10px' }}
          />
          {validator.message('message', message, 'required')}
          <Tooltip placement="top" title={<span>send image</span>}>
            <PaperClipOutlined className="attach-icon" onClick={() => handleModal(true)} />
          </Tooltip>
          <Payment />
          <Button type="primary" onClick={handleSubmit}>
            Send
          </Button>
        </div>
      </Content>

      {isModal && (
        <UploadModal
          handleModal={handleModal}
          isModal={isModal}
          handleFileData={handleFileData}
          handleIsImage={handleIsImage}
          fileList={fileList}
          imageUrls={imageUrls}
          handleImageUrls={handleImageUrls}
          handleSubmit={handleSubmit}
        />
      )}

      {isPreview && (
        <ImageModal
          isPreview={isPreview}
          handlePreview={handlePreview}
          previewedImage={previewedImage}
        />
      )}
    </Layout>
  );
};

export default Chat;
