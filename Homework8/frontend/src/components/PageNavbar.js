import React, {Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ToggleButton from './ToggleButton.js';
import CustomSearch from './CustomSearch.js';
import '../custom_css/MyNavbar.css';
import {FaRegBookmark, FaBookmark} from 'react-icons/fa';
import { withRouter, NavLink  } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class PageNavbar extends Component {

    render() {
        return (
                <Navbar bg="light" expand="lg">
                    {/*<Container fluid>
                    <Row className="nav-row">
                        <Col xs={10} sm={10} md={10} lg={3} xl={3}>*/}
                          <CustomSearch
                            handleInputChange = {(inputValue) => this.props.handleInputChange(inputValue)}
                            search = {this.props.search}
                            handleSearch={(obj) => this.props.handleSearch(obj)}
                          />
                          {/*</Col>*/}
                          <Navbar.Toggle aria-controls="responsive-navbar-nav" className="" />
                          {/*<Col lg={9} xl={9}>*/}
                          <Navbar.Collapse id="basic-navbar-nav" className="nav_right_section">
                            <Nav className="mr-auto">
                                <NavLink exact className="category"  to="/" >Home</NavLink>
                                <NavLink className="category" to="/world" >World</NavLink>
                                <NavLink className="category" to="/politics" >Politics</NavLink>
                                <NavLink className="category" to="/business" >Business</NavLink>
                                <NavLink className="category" to="/technology" >Technology</NavLink>
                                <NavLink className="category" to="/sports" >Sports</NavLink>
                            </Nav>
                            <Nav >
                          {
                             this.props.inBookmarksPage ?
                             <Navbar.Text>
                                <FaBookmark className='bmlink' />
                             </Navbar.Text>
                             :
                             <Navbar.Text>
                                 <NavLink to="/favourites" href="/favourites">
                                    <FaRegBookmark
                                        data-tip = 'Bookmark'
                                        className='bmlink'
                                        data-for = "test"
                                     />
                                     <ReactTooltip
                                         place= 'bottom'
                                         type = 'dark'
                                         effect = 'solid'
                                         id="test"
                                      />
                                 </NavLink>
                             </Navbar.Text>
                          }

                          {
                            (this.props.displayToggle) &&
                            <>
                                <Navbar.Text className="channel">
                                    NYTimes
                                 </Navbar.Text>

                                 <Navbar.Text>
                                 <ToggleButton/>
                                 </Navbar.Text>

                                  <Navbar.Text className="channel">
                                      Guardian
                                  </Navbar.Text>
                            </>
                          }
                          </Nav>
                     </Navbar.Collapse>
                     {/*</Col>
                   </Row>
                </Container>*/}
                 </Navbar>
            )
    }
}
export default withRouter(PageNavbar);