import React from 'react';
import { Collapse, Layout, Space } from 'antd';
import { Link } from 'react-router-dom';
import './FAQ.css';
import Faq from '../../assets/faq.png';
import GlobalHeader from '../../shared/header';

const { Panel } = Collapse;
const { Content } = Layout;

const FAQ = () => (
  <Layout style={{ flex: 1, overflow: 'hidden' }}>
    <GlobalHeader title={'FAQ'} />
    <Content style={{ padding: '24px', overflow: 'auto' }}>
      <div className="faq-container">
        <Space direction="vertical">
          <img
            className="c-image"
            src={Faq}
            alt=""
            style={{ width: '100%', maxWidth: '1000px', height: 'auto', marginBottom: '16px' }}
          />
          <h1 className="h1">Here are some of the Frequently Asked Questions.</h1>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="How do I create an account on the marketplace website?" key="1">
              <p>
                To create an account, click on the "Sign Up" button on the homepage and follow the
                prompts to provide your email address, choose a password, and fill in your personal
                information.
              </p>
            </Panel>
          </Collapse>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="How can I search for products or services on the marketplace?" key="2">
              <p>
                You can use the search bar on the top of the website's homepage to enter keywords
                related to the product or service you're looking for. The search results will
                display relevant listings.
              </p>
            </Panel>
          </Collapse>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="How do I contact a seller about a specific listing?" key="3">
              <p>
                Once you've found a listing you're interested in, click on it to view the details.
                On the listing page, you'll find a contact button or an option to send a message to
                the seller. Use this feature to communicate directly with the seller.
              </p>
            </Panel>
          </Collapse>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="How can I buy a product or service on the marketplace?" key="4">
              <p>
                When you find a product or service you want to purchase, click on it to view the
                details. If the seller allows online transactions, you'll typically find a "Buy Now"
                or "Add to Cart" button. Follow the instructions to complete the purchase securely.
              </p>
            </Panel>
          </Collapse>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="What payment methods are accepted on the marketplace?" key="5">
              <p>
                The marketplace website accepts various payment methods, including credit/debit
                cards, PayPal, and other popular online payment platforms. The available payment
                options are usually displayed during the checkout process.
              </p>
            </Panel>
          </Collapse>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="Can I sell my own products or services on the marketplace?" key="6">
              <p>
                Absolutely! The marketplace provides a platform for individuals and businesses to
                sell their products or services. To start selling, create an account and follow the
                seller registration process.
              </p>
            </Panel>
          </Collapse>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="How do I manage my listings as a seller?" key="7">
              <p>
                As a seller, you can manage your listings through your account dashboard. You can
                add new listings, update existing ones, adjust prices, and remove listings that are
                no longer available.
              </p>
            </Panel>
          </Collapse>
          <Collapse className="custom-panel" collapsible="icon">
            <Panel header="What happens if there is a problem with my purchase?" key="8">
              <p>
                If you encounter any issues with your purchase, such as receiving a faulty item or
                not receiving it at all, you should contact the seller directly to resolve the
                problem. Most sellers are willing to work with buyers to find a satisfactory
                solution.
              </p>
            </Panel>
          </Collapse>
          <p className="p">
            If you have additional questions, you can contact us through our{' '}
            <Link to="/contact-us">Contact Us!</Link> page.
          </p>
        </Space>
      </div>
    </Content>
  </Layout>
);

export default FAQ;
