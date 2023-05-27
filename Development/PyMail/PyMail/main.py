# See PyCharm help at https://www.jetbrains.com/help/pycharm/
# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import os
import smtplib, ssl
import sys

from dotenv import load_dotenv, find_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from confluent_kafka import Consumer, KafkaException, KafkaError

##
##CONSUMER
##
conf = {'bootstrap.servers': 'where the broker address goes',
        'group.id': 'emailStream',
        'auto.offset.reset': 'smallest'}

consumer = Consumer(conf)
topic = 'userEmail'

running = True

def main():
    try:
        consumer.subscribe(topic)
        while running:
            #pull from the consumer
            message = consumer.poll(timeout=1.0)
            if message is None: continue

            if message.error():
                if message.error().code() == KafkaError._PARTITION_EOF:
                    #End of partition event
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' %
                                     (message.topic(), message.partition(), message.offset()))
                elif message.error():
                    raise KafkaException(message.error())
            else:
                data = message.value().decode('utf-8')
                print(data)
    finally:
        consumer.close()

def sendTheEmail(userEmail) :
    ##
    ##EMAIL
    ##

    #load the .env variables
    load_dotenv(find_dotenv())

    smtpServer = os.environ.get('EMAILSERVER', 'default')
    #for ssl use 465
    #for tls use 587
    port = 465

    emailSender = os.environ.get('EMAILSENDER', 'default')
    emailPassword = os.environ.get('EMAILPASSWORD', 'default')
    emailReceiver = userEmail

    context = ssl.create_default_context()

    # email
    subject = 'New User Registered'
    html = """/
    <html>
        <head>
        </head>
        <body>
            <p> Your account was created.<br>
            Thank you for registering with us!
            </p>
            <p><strong>If this was not you please contact us at: jentestspam@gmail.com</strong></p>
        </body>
    </html>
    """

    emailObject = MIMEMultipart('alternatives')
    emailObject['Subject'] = subject
    emailObject['From'] = 'No Reply'
    emailObject['To'] = emailReceiver

    htmlContent = MIMEText(html, 'html')
    emailObject.attach(htmlContent)

    #for ssl
    with smtplib.SMTP_SSL(smtpServer, port, context=context) as server:
        server.login(emailSender, emailPassword)
        print("connected")
        server.sendmail(emailSender, emailReceiver, emailObject.as_string())
        print("sent to: " + emailReceiver)

    #for tls
    # server = smtplib.SMTP(smtpServer, port)
    # try:
    #     server.ehlo()
    #     server.starttls(context=context)
    #     server.ehlo()
    #     server.login(emailSender, emailPassword)
    #     server.sendmail(emailSender, emailReceiver, emailObject.as_string())
    # except Exception as e:
    #     print(e)
    # finally:
    #     server.quit()