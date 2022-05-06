const nodemailer = require('nodemailer');

const registration = (name, email, strings) => {

    const output = `
       <body style="width: 50%; margin: auto;font-family: Nunito, sans-serif; font-size: 15px; font-weight: 400;">
        <!-- Loader -->
        <!-- <div id="preloader">
            <div id="status">
                <div class="spinner">
                    <div class="double-bounce1"></div>
                    <div class="double-bounce2"></div>
                </div>
            </div>
        </div> -->
        <!-- Loader -->

        <!-- Hero Start -->
        <section style="align-items: center; padding: 0;">
            <div class="container">
                <div class="row" style="justify-content: center;">
                    <div class="col-lg-6 col-md-8"> 
                        <table style="box-sizing: border-box; width: 100%; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">
                            <thead>
                                <tr style="background-color: #2f55d4; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                                    <th scope="col"><img src="images/logo-light.png" height="24" alt=""></th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">
                                        Hello, ${name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 24px 15px; color: #8492a6;">
                                        Thanks for creating an account with us. To continue, please confirm your email address by clicking the button below :
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 15px 24px;">
                                        <a href="http://localhost:5000/users/check/${strings}" class="btn-primary" style="background-color: #2f55d4 !important; border: 1 px solid #2f55d4 !important;
    color: #ffffff !important; padding: 8px 20px; outline: none; text-decoration: none; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s; font-weight: 600; border-radius: 6px;">Confirm Email Address</a>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 15px 24px 0; color: #8492a6;">
                                        This link will be active for 30 min from the time this email was sent.
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 15px 24px 15px; color: #8492a6;">
                                        tracking <br> Support Team
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">
                                        © 2019-20 tracking.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div><!--end col-->
                </div><!--end row-->
            </div> <!--end container-->
        </section><!--end section-->
    </body>  

    `;

        // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.GMAIL_USERMAIL,
        pass: process.env.GMAIL_PASSWORD
        }
    });

      // setup email data with unicode symbols
    let mailOptions = {

        from: '"Tracking Application" <tracking@balearner.org>',
        to: `${email}`, 
        subject: 'Confirm Registration - Project',
        html: output // html body
    
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
        return console.log(error);
        }
    
        console.log('🙂 😇  Message sent: %s', info.messageId);
    });

}

module.exports = { registration }