import { Stripe } from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
  });

export const POST = async(request: any) => {
    // const req = await request.json();

    // console.log("-------------------Session req from post is ----------------------- ",req);

    const { item } = await request.json();
    console.log("item from the route post req: ============================ ",item)

    const transformedItem = {
        price_data: {
         currency: 'usd',
         product_data:{
           name: item.name,
           description: item.description,
           images:[item.image],
           metadata:{name:"some additional info",
                    task:"Usm created a task"},

         },
         unit_amount: item.price * 100,

       },
       quantity: item.quantity,
       
     };

     const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3002/'
      : '';


      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [transformedItem],
        mode: 'payment',
        success_url: redirectURL + '/success',
        cancel_url: redirectURL + '/cancel',
        metadata: {
          images: item.image,
        },
      });

      console.log("response-------------------",session);
    return NextResponse.json(session?.id) ;

}