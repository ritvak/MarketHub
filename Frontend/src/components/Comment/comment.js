// import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Comment } from '@ant-design/compatible';
import { Avatar, Button, Form, Input, List, Divider, Layout, Space } from 'antd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import APIUtils from '../../helpers/APIUtils';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { app } from '../../firebase';
import GlobalHeader from '../../shared/header';
import './comment.css';

const { Content } = Layout;
const { TextArea } = Input;
const api = msg => new APIUtils(msg);
const db = getDatabase(app);

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={
      <div>
        <span style={{ fontWeight: 'bold' }}>{comments.length} </span>
        <span style={{ fontWeight: 'bold' }}>{comments.length > 1 ? ' Comments' : ' Comment'}</span>
      </div>
    }
    itemLayout="horizontal"
    className="custom-comment-list"
    renderItem={(props, index) => (
      <>
        {index > 0 && <Divider style={{ margin: '8px 0' }} />}
        <Comment {...props} />
      </>
    )}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value, navigateToproducts, id }) => (
  <div style={{ borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
    <Form.Item>
      <TextArea
        rows={4}
        onChange={onChange}
        value={value}
        style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
      />
    </Form.Item>
    <Form.Item>
      <Space size="middle" wrap>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          Add Comment
        </Button>
        <Button
          htmlType="submit"
          loading={submitting}
          onClick={() => navigateToproducts(id)}
          type="primary"
        >
          Back
        </Button>
      </Space>
    </Form.Item>
  </div>
);

let counter = 0;

const App = () => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const [firebaseValue, setFirebaseValue] = useState(0);

  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');
  // console.log(name+"name");

  const getData = async () => {
    try {
      const res = await api(false).getALlComments({ productId: id });

      // setCommentData(res.data);
      const transformedComments = res.data.map(comment => ({
        author: comment.user,
        content: <p> {comment.comment}</p>,
        datetime: moment(comment.createdAt).fromNow(),
      }));
      setComments(transformedComments);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const dataRef = ref(db, 'user');
    const unsubscribe = onValue(dataRef, snapshot => {
      const value = snapshot.val();
      setFirebaseValue(value);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const putData = () => {
    set(ref(db, 'user'), firebaseValue + 1);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [firebaseValue]);

  const handleSubmit = async () => {
    putData();
    if (!value) return;
    setSubmitting(true);
    const data = {
      productId: id,
      comment: value,
    };

    const res = await api(true).createComment(data);
    setSubmitting(false);
    setValue('');
    (async () => {
      await getData();
    })();
  };

  const handleChange = e => {
    setValue(e.target.value);
  };
  const navigateToproducts = id => {
    console.log(id);
    navigate(`/products/${id}`);
  };

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      <GlobalHeader title={name} />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <div style={{ backgroundColor: '#f5f5f5' }}>
          <Comment
            content={
              <Editor
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                value={value}
                navigateToproducts={navigateToproducts}
                id={id}
              />
            }
          />
          {comments.length > 0 && <CommentList comments={comments} />}
        </div>
      </Content>
    </Layout>
  );
};

export default App;
