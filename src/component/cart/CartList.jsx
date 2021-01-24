
import { useState, useContext, useEffect } from 'react';
import Define from '../../utils/Define';
import { DispatchContext, StateContext } from './../../utils/context/AppContext';
import ListAction from './../../utils/actions/ListAction';
import AppAction from './../../utils/actions/AppAction';
import Response from './../../utils/Response';



export default function CartList() {

    const { auth } = useContext(StateContext)
    const { appDispatch, ordersDispatch } = useContext(DispatchContext)

    const [cart, setCart] = useState(
        (process.browser) ?
            localStorage.getItem(Define.CART_LOCAL) ? JSON.parse(localStorage.getItem(Define.CART_LOCAL)) : []
            : []
    )
    const [orderInfo, setOrderInfo] = useState({
        so_num: "",
        admin_id: "",
        customer_name: "",
        order_desc: "",
        product_list: []
    })



    //
    useEffect(() => {
        setCart(cart => {
            const arr = cart.map(itm => {
                itm.part_stock = 0
                return itm;
            })
            return arr;
        })
    }, [])

    //stockChange
    const stockChange = (e) => {
        const id = e.target.id
        setCart(cart => {
            const arr = cart.map(itm => {
                if (itm.id === id) {
                    itm.part_stock = parseInt(e.target.value)
                }
                return itm;
            })
            return arr;
        })
    }

    //onCustomerChnage
    const onCustomerChnage = (e) => {
        setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value })
    }

    const clearCart = (e) => {
        setCart([])
        if (process.browser) {
            localStorage.removeItem(Define.CART_LOCAL)
        }
    }

    //completeOrder
    const completeOrder = async () => {

        orderInfo['product_list'] = cart
        orderInfo['admin_id'] = auth.id

        if (cart.length === 0 || orderInfo['so_num'] === "" || orderInfo['customer_name'] === "") {
            AppAction.getInstance(appDispatch).SET_RESPONSE(Response(false, "Enter All Field Value", "Add Some parts in the cart", "danger"));
            return
        }

        //return console.log(orderInfo);

        //list action to order list
        AppAction.getInstance(appDispatch).START_LOADING();
        //add new info
        ListAction.getInstance(ordersDispatch).addData(`order/new`, orderInfo).then(res => {
            AppAction.getInstance(appDispatch).STOP_LOADING();
            AppAction.getInstance(appDispatch).SET_RESPONSE(Response(true, res.message, `Order Created Successfully`, "success"));
            AppAction.getInstance(appDispatch).RELOAD();
        }).catch(e => {
            AppAction.getInstance(appDispatch).STOP_LOADING();
            AppAction.getInstance(appDispatch).SET_RESPONSE(Response(false, e.message, "Something Went Wrong! try again", "danger"));
        });

    }


    return (
        <div>
            <div className="container">
                <section className="mt-5 mb-4">


                    <div className="row">

                        {/* sidebar start */}

                        <div className="col-lg-4">

                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="mb-3">Order Information</h5>
                                    <ul className="list-group list-group-flush">

                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 my-2">
                                            1.<span><input name="so_num" value={orderInfo.so_num} onChange={onCustomerChnage} type=" text" className="form-control" placeholder="Sales Order NO#" /></span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 my-2">
                                            2.<span><input name="customer_name" value={orderInfo.customer_name} onChange={onCustomerChnage} type="text" className="form-control" placeholder="Customer Name" /></span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 my-2">
                                            3.<span><input name="order_desc" value={orderInfo.order_desc} onChange={onCustomerChnage} type="text" className="form-control" placeholder="Descritpion" /></span>
                                        </li>

                                    </ul>
                                    <button onClick={completeOrder} type="button" className="mt-3 btn btn-primary btn-block waves-effect waves-light">Complete Order</button>
                                    <button onClick={clearCart} type="button" className="mt-3 btn btn-danger btn-block waves-effect waves-light">Clear Order List</button>
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-8">
                            <div className="card wish-list mb-4">
                                <div className="card-body">
                                    <h5 className="mb-4">Cart List</h5>

                                    {cart.map(itm => {
                                        return <div key={itm.id} className="row mb-4">
                                            <div className="col-md-4 col-lg-3 col-xl-3">
                                                <div className="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">
                                                    <img className="img-fluid w-50" src={itm.parts_img} alt="Sample" />
                                                </div>
                                            </div>
                                            <div className="col-md-8 col-lg-9 col-xl-9">
                                                <div>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5>Title: {itm.part_title}</h5>
                                                            <p className="mb-3 text-muted text-uppercase small">ID: {itm.id}</p>
                                                        </div>
                                                        <div>
                                                            <div className="def-number-input number-input safari_only mb-0 w-100">
                                                                <input id={itm.id} onChange={stockChange} className="form-control" min="1" name="quantity" value={itm.part_stock} type="number" />
                                                            </div>
                                                            <small id="passwordHelpBlock" className="form-text text-muted text-center">
                                                                (Quantity)
                                                        </small>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            {/* <button className="btn btn-danger"><i className="fa fa-trash "></i> Remove item</button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })}



                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </div>

        </div>
    )
}