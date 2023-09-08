import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import APIUtils from '../helpers/APIUtils';
import { handleCollapse, handleSidebarChange } from '../redux/actions/sidebarAction';
import { logout } from '../redux/actions/authActions';
import './header.css';
import { Input, AutoComplete, Spin } from 'antd';

const { Header } = Layout;
const api = new APIUtils();

const GlobalHeader = ({ title, handleSearchResults }) => {
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCollapsed, activatedSidebarKey, sidebarData } = useSelector(state => state.sidebar);
  const { selectedChat, chatList } = useSelector(state => state.chat);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [label, setLabel] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Search } = Input;

  // Function to handle the search logic
  const handleSearch = async value => {
    try {
      setLoading(true);
      const searchData = await api.getALlProducts({ searchTerm: value });
      console.log('Search Results:', searchData.data.products);
      handleSearchResults(searchData.data.products);
    } catch (error) {
      console.error('Error in searchProducts API:', error);
    }
    setLoading(false);
  };

  const handleSearchProduct = async value => {
    try {
      setLoading(true);
      const selectedProduct = suggestions.find(item => item.name === value);
      navigate(`/products/${selectedProduct.id}`);
    } catch (error) {
      console.error('Error in searchSuggestedProducts API:', error);
    }
    setLoading(false);
  };

  // Function to handle the search suggestion logic
  const handleSearchSuggestions = async value => {
    try {
      setSearchTerm(value);
      // Call the getSearchSuggestions API function
      const suggestions = await api.suggestion({ searchTerm: value });
      setSuggestions(suggestions.data);
      console.log('Search Suggestions:', suggestions.data);
    } catch (error) {
      console.error('Error in getSearchSuggestions API:', error);
    }
  };

  const storeLabel = async () => {
    const [filterData] = sidebarData.filter(cur => cur.key === activatedSidebarKey?.key);
    const tempData = {
      key: activatedSidebarKey?.key,
      label: filterData?.label,
    };
    await dispatch(handleSidebarChange(tempData));
    setLabel(filterData?.label);
  };

  useEffect(() => {
    (async () => {
      if (!activatedSidebarKey?.label) await storeLabel();
      else setLabel(activatedSidebarKey?.label);
    })();
  }, [activatedSidebarKey?.key]);

  useEffect(() => {
    setLabel(`${activatedSidebarKey?.label} / ${selectedChat?.label}`);
  }, [selectedChat?.key]);

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      className="header-container"
    >
      <div className="title-section">
        {isAuthenticated && (
          <Button
            type="text"
            icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => dispatch(handleCollapse())}
            className="menu-button"
          />
        )}
        {title !== 'Products' && <span className="title-text">{title}</span>}
      </div>
      {isAuthenticated && (
        <div className="centered-search-bar">
          <AutoComplete
            className="search-input"
            value={searchTerm}
            onChange={handleSearchSuggestions}
            onSelect={handleSearchProduct}
            placeholder="Search products..."
            options={suggestions.map(item => ({ value: item.name, id: item.id }))}
          >
            <Search enterButton loading={loading} onSearch={handleSearch} />
          </AutoComplete>
        </div>
      )}
    </Header>
  );
};

export default GlobalHeader;
