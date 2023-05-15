const express = require("express")
const router = express.Router();

const Booking = require('../models/booking')
const Room = require('../models/room')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51N0dWQSBXKgnFO2XztXflxOxaUmYZ2DEL7BlTifVpVNNH1XYW0xRuXjoZOQikecztDVnx7nAMPxWFD10ICNXQ8V200f6KCe2pM')

router.post("/bookroom", async (req, res) => {
    const {
        room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token
    } = req.body
    // try {
    //     const customer = await stripe.customers.create({
    //         email: token.email,
    //         source: token.id,
    //     });
    //     const payment = await stripe.charges.create(
    //         {
    //             amount: totalamount * 100,
    //             customer: customer.id,
    //             currency: 'INR',
    //             receipt_email: token.email,
    //         }, {
    //         idempotencyKey: uuidv4(),
    //     }
    //     );
    // }
    // catch (error) {
    //     return res.status(400).json({ error })
    // }
    try {
        const newbooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: fromdate,
        todate: todate,
        // fromdate: moment(fromdate , 'DD-MM-YYYY'),
        // todate: moment(todate , 'DD-MM-YYYY'),
        totalamount,
        totaldays,
        transactionId: '1234'
    })
    const booking = await newbooking.save()
    // console.log(room._id)
    // console.log(booking._id)
    // console.log(fromdate)
    // console.log(todate)
    // console.log(userid)
    // console.log(booking.status)

    const roomtemp = await Room.findOne({ _id: room._id })
    roomtemp.currentbookings.push({
        bookingid: booking._id,
        // fromdate: moment(fromdate , 'DD-MM-YYYY'),
        // todate: moment(todate , 'DD-MM-YYYY'),
        fromdate: fromdate,
        todate: todate,
        userid: userid,
        status: booking.status
    })
    await roomtemp.save()
    res.send('Payment Successfull, Your Room is booked')
}
    catch (error) {
    return res.status(400).json({ error })
}
});

router.post("/getbookingsbyuserid", async (req, res) => {
    const userid = req.body.userid
    try {
        const bookings = await Booking.find({ userid: userid })
        res.send(bookings)
    }
    catch (error) {
        return res.status(400).json({ error })
    }
});

router.post("/cancelbooking", async (req, res) => {
    const { bookingid, roomid } = req.body
    try {
        const bookingitem = await Booking.findOne({ _id: bookingid })
        bookingitem.status = 'Cancelled'
        await bookingitem.save()
        const room = await Room.findOne({ _id: roomid })
        const bookings = room.currentbookings
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
        room.currentbookings = temp
        await room.save()
        res.send("Your booking cancelled successfully")
    }
    catch (error) {
        return res.status(400).json({ error })
    }
});

router.get("/getallbookings", async (req, res) => {
    try {
        const bookings = await Booking.find()
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({ error })
    }
});

module.exports = router;