from datetime import timedelta
import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie

from scam_detector.services.whatsapp_service import WhatsappService
from .utils import format_phone_number, hash_phone_number, is_valid_telegram_data, send_purchase_event
from scam_detector.services.message_processor import MessageProcessor
from .models import UserProfile
from .services import FirebaseService, UserProfileService, PlanService
from scam_detector.services.telegram_service import TelegramService
import logging
import stripe
from .settings import STRIPE_SIGNATURE, STRIPE_SECRET_KEY, WHATSAPP_VERIFY_TOKEN
from django.middleware import csrf

logger = logging.getLogger('myapp')


def health_check(request):
    return JsonResponse({'status': 'ok'})


def user_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            firebase_token = data.get('firebaseToken')
            
            firebaseService = FirebaseService(firebase_token)
            uid, email = firebaseService.verify_firebase_token()

            if not email or email.strip() == "":
                logger.error('user_register - E-mail vazio, não é possível registrar usuário.')
                return JsonResponse({'error': 'E-mail não pode ser vazio.'}, status=400)

            userProfileService = UserProfileService(uid, email)
            user_exists = userProfileService.get_user_profile_by_uid()
            if not user_exists:
                user = userProfileService.get_user_by_email()
            if user_exists:
                return JsonResponse(
                    {'message': f'Usuário {email} já cadastrado. por favor faça login ou use outro email para se cadastrar.',},
                    status=200
                )
            else:
                user = userProfileService.create_user_checkout()
                user_exists = userProfileService.get_user_profile_by_uid()
                if type(user) == UserProfile:
                    expires_in = expires_in = timedelta(days=5)
                    session_cookie = firebaseService.create_cookie(expires_in)
                    searchs = userProfileService.get_user_searchs_by_uid()
                    telegram_chat_id = userProfileService.get_user_telegram_chat_id()
                    if telegram_chat_id:
                        telegram_conect = True
                    else:
                        telegram_conect = False
                    response = JsonResponse(
                        {'message': f'Usuário {email} registrado com sucesso.',
                        'user': {
                            'id': user_exists.firebase_uid,
                            'plan': user_exists.plan.name,
                            'email': email,
                            'limit': searchs.limit,
                            'usedLimit': searchs.limit_used,
                            'TelegramConect': telegram_conect
                            }
                        },
                        status=200
                    )
                    response.set_cookie(
                        "session",
                        session_cookie,
                        max_age=expires_in.total_seconds(),
                        httponly=True,
                        secure=True,  # use HTTPS!
                        samesite="Strict"
                    )
                    return response
                else:
                    logger.error(f'Erro ao registrar usuário: ERRO:{user}')
                    return JsonResponse(
                        {'error': f'Erro ao registrar usuário: ERRO:{user}'},
                        status=500
                    )

        except Exception as e:
            logger.error(f'Erro na view user_register: {e}')
            return JsonResponse({'error': str(e)}, status=500)
        

def user_login_google(request):
    if request.method == 'POST':
        try:
            logger.info('user_login_google - Recebendo requisição POST')
            data = json.loads(request.body)
            firebase_token = data.get('firebaseToken')
            logger.info(f'user_login_google - Token recebido: {firebase_token is not None}')
            firebaseService = FirebaseService(firebase_token)
            uid, email = firebaseService.verify_firebase_token()
            logger.info(f'user_login_google - Token verificado para uid: {uid}, email: {email}')

            if not email or email.strip() == "":
                logger.error('user_login_google - E-mail vazio, não é possível criar usuário.')
                return JsonResponse({'error': 'E-mail não pode ser vazio.'}, status=400)

            userProfileService = UserProfileService(uid=uid, email=email)
            logger.info('user_login_google - Instanciado UserProfileService')
            user = userProfileService.get_user_profile_by_uid()
            logger.info(f'user_login_google - get_user_profile_by_uid: {user}')
            if not user:
                logger.info(f'user_login_google - Criando novo usuário para uid: {uid}, email: {email}')
                try:
                    user = userProfileService.create_user_checkout()
                    logger.info(f'user_login_google - Resultado create_user_checkout: {user}')
                except Exception as e:
                    logger.error(f'user_login_google - Erro ao criar usuário: {str(e)}', exc_info=True)
                    return JsonResponse({'error': f'Falha ao criar usuário: {str(e)}'}, status=500)
                if not user or not isinstance(user, UserProfile):
                    logger.error(f'user_login_google - Falha ao criar usuário. Retorno: {user}')
                    return JsonResponse(
                        {'error': 'Falha ao criar usuário'},
                        status=500
                    )
                logger.info(f'user_login_google - Usuário criado com sucesso: {user.firebase_uid}')

            expires_in = timedelta(days=5)
            session_cookie = firebaseService.create_cookie(expires_in)
            logger.info('user_login_google - Cookie de sessão criado')
            searchs = userProfileService.get_user_searchs_by_uid()
            logger.info(f'user_login_google - Searchs recuperado: {searchs}')
            telegram_chat_id = user.telegram_chat_id
            if telegram_chat_id:
                telegram_conect = True
            else:
                telegram_conect = False
            response = JsonResponse(
                {
                    'message': f'Usuário {email} logado com sucesso.',
                    'user': {
                        'id': user.firebase_uid,
                        'email': email,
                        'plan': user.plan.name,
                        'limit': searchs.limit,
                        'usedLimit': searchs.searchs,
                        'TelegramConect': telegram_conect
                    }
                },
                status=200
            )
            response.set_cookie(
                "session",
                session_cookie,
                max_age=expires_in.total_seconds(),
                httponly=True,
                secure=True,
                samesite="Strict"
            )
            logger.info('user_login_google - Resposta final montada e cookie setado')
            return response

        except Exception as e:
            logger.error(f'user_login_google - Erro inesperado: {str(e)}', exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)
    else:
        logger.warning('user_login_google - Método não permitido')
        return JsonResponse({'error': 'Método não permitido.'}, status=405)


def user_login(request):
    if request.method == 'POST':
        logger.info(f'user_login')
        try:
            logger.info(f'user_login try')
            data = json.loads(request.body)
            firebase_token = data.get('firebaseToken')
            firebaseService = FirebaseService(firebase_token)
            uid, email = firebaseService.verify_firebase_token()
            userProfileService = UserProfileService(uid, email)
            user_exists = userProfileService.get_user_profile_by_uid()
            if not user_exists:
                user_exists = userProfileService.get_user_by_email()
            logger.debug(f'user_exists: {user_exists}')
            if user_exists:
                if user_exists.phone_encrypted is not None and user_exists.phone_encrypted != '':
                    phone = userProfileService.get_user_phone_by_uid()
                else: 
                    phone = None
                searchs = userProfileService.get_user_searchs_by_uid()
                telegram_chat_id = userProfileService.get_user_telegram_chat_id()
                if telegram_chat_id:
                    telegram_conect = True
                else:
                    telegram_conect = False 
                response = JsonResponse(
                    {
                    'message': f'Usuário {email} logado com sucesso.',
                    'user': {
                        'id': user_exists.firebase_uid,
                        'email': email,
                        'plan': user_exists.plan.name,
                        'limit': searchs.limit,
                        'usedLimit': searchs.searchs,
                        'TelegramConect': telegram_conect
                    }
                    },
                    status=200
                )
                expires_in = expires_in = timedelta(days=5)
                session_cookie = firebaseService.create_cookie(expires_in)
                response.set_cookie(
                    "session",
                    session_cookie,
                    max_age=expires_in.total_seconds(),
                    httponly=True,
                    secure=True,
                    samesite="Strict"
                )
                return response
            else:
                logger.error(f'Usuário {email} não encontrado.')
                return JsonResponse(
                    {
                        'error': f'Usuário {email} não encontrado.',
                        'message': f'Email ou senha inválidos.'
                    },
                    status=404
                )
        except Exception as e:
            logger.error(f'Erro na view user_login: {e}')
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método não permitido.'}, status=405)


def fast_login(request):
    logger.info(f'fast_login - method: {request.method}')
    if request.method == 'POST':
        session_cookie = request.COOKIES.get("session")
        logger.info(f'fast_login - session_cookie: {session_cookie is not None}')
        if not session_cookie:
            return JsonResponse({"error": "Não autenticado - Cookie não encontrado"}, status=401)
        try:
            decoded = FirebaseService.verify_session_cookie(session_cookie)
            uid = decoded['uid']
            logger.info(f'fast_login - uid: {uid}')
            userProfileService = UserProfileService(uid)
            user_exists = userProfileService.get_user_profile_by_uid()
            if not user_exists:
                user_exists = userProfileService.get_user_by_email()
            logger.info(f'fast_login - user_exists: {user_exists is not None}')
            if user_exists:
                searchs = userProfileService.get_user_searchs_by_uid() 
                email = userProfileService.get_user_email()
                telegram_chat_id = userProfileService.get_user_telegram_chat_id()
                if telegram_chat_id:
                    telegram_conect = True
                else:
                    telegram_conect = False

                return JsonResponse({
                        'message': f'Usuário {email} logado com sucesso.',
                        'user': {
                            'id': user_exists.firebase_uid,
                            'email': email,
                            'plan': user_exists.plan.name,
                            'limit': searchs.limit,
                            'usedLimit': searchs.searchs,
                            'TelegramConect': telegram_conect
                        },
                    },
                    status=200
                )
            else:
                logger.error(f'fast_login - Usuário não encontrado para uid: {uid}')
                return JsonResponse({"error": f"Usuário não encontrado para uid: {uid}"}, status=404)
        except Exception as e:
            logger.error(f'fast_login - Erro ao verificar sessão: {str(e)}')
            return JsonResponse({"error": f"Não autenticado - {str(e)}"}, status=401)
    else:
        logger.error(f'fast_login - Método não permitido: {request.method}')
        return JsonResponse({"error": f"Método não permitido: {request.method}"}, status=405)

@ensure_csrf_cookie
def send_csrf_token(request):
    if request.method == 'GET':
        logger.info('send_csrf_token')
        return JsonResponse({'message': 'Token CSRF enviado com sucesso.'}, status=200)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)


def user_logout(request):
    if request.method == 'POST':
        logger.info(f'user_logout')
        try:
            logger.info(f'user_logout try')
            response = JsonResponse(
                {
                    'message': 'Usuário deslogado com sucesso.',
                },
                status=200
            )
            response.delete_cookie("session")
            return response
        except Exception as e:
            logger.error(f'Erro na view user_logout: {e}')
            return JsonResponse({'error ': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método não permitido.'}, status=405)


def user_update_telegram(request):
    if request.method == 'POST':
        logger.info("user_update_telegram: Metodo POST")
        session_cookie = request.COOKIES.get("session")
        if not session_cookie:
            logger.info("user_update_telegram error: Não autenticado")
            return JsonResponse({"error": "Não autenticado"}, status=401)
        try:
            decoded = FirebaseService.verify_session_cookie(session_cookie)
            uid = decoded['uid']
            email = decoded['email']               
            data = json.loads(request.body)
            user_telegram = data.get('userTelegram')
            if not is_valid_telegram_data(user_telegram):
                logger.info("user_update_telegram error: Dados do Telegram inválidos.")
                return JsonResponse({'error': 'Dados do Telegram inválidos.'}, status=403)
            telegram_chat_id = user_telegram["id"]
            if uid and email:
                userProfileService = UserProfileService(uid=uid, email=email, telegram_chat_id=telegram_chat_id)
                user_exists = userProfileService.get_user_profile_by_uid()
                if user_exists:
                    userProfileService.update_user_profile_telegram()
                    logger.info('user_update_telegram: Telegram chat ID atualizado com sucesso.')
                    return JsonResponse({
                            'message': 'Telegram chat ID atualizado com sucesso.',
                            'TelegramConect': True
                        }, 
                        status=200)
                else:
                    logger.info('user_update_telegram: Usuário não encontrado')
                    return JsonResponse({
                            'error': 'Usuário não encontrado.',
                            'TelegramConect': False
                        }, status=404)
            else:
                logger.error(f'Token do Firebase inválido ou expirado.')
                return JsonResponse({
                    'error': 'Token do Firebase inválido ou expirado.',
                    'TelegramConect': True
                }, status=401)
        except Exception as e:
            logger.error(f'Erro na view user_update_telegram: {e}')
            return JsonResponse({'error': str(e), 'TelegramConect': [False]}, status=500)
    else:
        return JsonResponse({'error': 'Método não permitido.'}, status=405)



def user_update_user_name(request):
    if request.method == 'POST':
        
        session_cookie = request.COOKIES.get("session")
        if not session_cookie:
            return JsonResponse({"error": "Não autenticado"}, status=401)
        try:
            decoded = FirebaseService.verify_session_cookie(session_cookie)
            uid = decoded['uid']
            email = decoded['email']               
            data = json.loads(request.body)
            user_name = str(data.get('userName'))
            if uid and email:
                userProfileService = UserProfileService(uid=uid, email=email)
                user_exists = userProfileService.get_user_profile_by_uid()
                if user_exists:
                    userProfileService.update_user_name(user_name)
                    return JsonResponse({
                        'message': 'Nome de usuario atualizado com sucesso.'}, 
                        status=200)
                else:
                    return JsonResponse({
                        'error': 'Usuário não encontrado.'}, status=404)
            else:
                logger.error(f'Token do Firebase inválido ou expirado.')
                return JsonResponse({'error': 'Token do Firebase inválido ou expirado.'}, status=401)
        except Exception as e:
            logger.error(f'Erro na view update_user_name: {e}')
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método não permitido.'}, status=405)


def user_update_phone_number(request):
    if request.method == 'POST':
        session_cookie = request.COOKIES.get("session")
        if not session_cookie:
            return JsonResponse({"error": "Não autenticado"}, status=401)
        try:
            decoded = FirebaseService.verify_session_cookie(session_cookie)
            uid = decoded['uid']
            email = decoded['email']

            data = json.loads(request.body)
            phone_number = data.get('phoneNumber')
            phone_number_hash = hash_phone_number(phone_number)
             
            if uid and email:
                userProfileService = UserProfileService(uid=uid, email=email, phone_hash=phone_number_hash)
                user_exists = userProfileService.get_user_profile_by_uid()
                
                if user_exists:
                    verify = userProfileService.update_user_profile_phone()
                    if type(verify) == UserProfile:
                        return JsonResponse({
                            'message': 'Número de telefone atualizado com sucesso.',
                            'WhatsAppConnect': True
                            },
                             
                            status=200)
                    else:
                        return JsonResponse({
                            'error': 'Erro ao atualizar número de telefone.', 
                            'message': 'codigo de verificação inválido'}, 
                            status=500)
                else:
                    return JsonResponse({
                        'error': 'Usuário não encontrado.'}, status=404)
            else:
                logger.error(f'Token do Firebase inválido ou expirado.')
                return JsonResponse({'error': 'Token do Firebase inválido ou expirado.'}, status=401)
        except Exception as e:
            logger.error(f'Erro na view user_upadete_phone_number: {e}')
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método não permitido.'}, status=405)



def create_checkout_session(request):
    if request.method == 'POST':
            logger.info("create_checkout_session: Metodo POST")
            session_cookie = request.COOKIES.get("session")
            if not session_cookie:
                logger.error("create_checkout_session error: Usuario Não autenticado")
                return JsonResponse({"error": "Não autenticado"}, status=401)
            try:
                decoded = FirebaseService.verify_session_cookie(session_cookie)
                uid = decoded['uid']
                email = decoded['email']
                logger.info("create_checkout_session: Estraido as informaçoes do cookie")

                data = json.loads(request.body)
                plan = data.get('plan')
                fbp = data.get('fbp')
                fbclid = data.get('fbclid')
                coin = data.get('coin')
                
                plan_exists = PlanService.get_plan_by_name(name=plan)
                if not plan_exists:
                    logger.error(f"create_checkout_session error: Plano inválido {plan}")
                    return JsonResponse({'error': 'Plano inválido'}, status=400)
                userProfileService = UserProfileService(uid=uid, email=email)
                user_exists = userProfileService.get_user_profile_by_uid()
                if not user_exists:
                    user_exists = userProfileService.get_user_by_email()
                logger.info(f'fast_login - user_exists: {user_exists is not None}')
                if user_exists:
                    if coin == 'real':
                        price_id = plan_exists.price_id_real
                        language = 'pt'
                    elif coin == 'dolar':
                        price_id = plan_exists.price_id_dolar
                        language = 'en'
                    else:
                        price_id = plan_exists.price_id
                        language = 'pt'
                    
                    stripe.api_key = STRIPE_SECRET_KEY
                    logger.info("create_checkout_session: Criando Session Checkout")
                    session = stripe.checkout.Session.create(
                        metadata={
                            'fbp': fbp,
                            'fbclid': fbclid,
                            'email_hash': user_exists.email_hash,
                            "language": language
                            },
                        mode='subscription',
                        line_items=[{'price': price_id, 'quantity': 1}],
                        client_reference_id=uid,
                        customer_email=email,
                        success_url='https://eciladabot.com.br/sucess',
                        cancel_url='https://eciladabot.com.br/error'
                    )
                    logger.info("create_checkout_session: Sucess")
                    return JsonResponse({'url': session.url})
                else:
                    logger.error(f'create_checkout_session - Usuario não encontrado:')
                    return JsonResponse({"error": f"Usuario não encontrado"}, status=401)
            except Exception as e:
                logger.error(f'create_checkout_session - Erro ao validar usuario: {str(e)}')
                return JsonResponse({"error": f"Não autenticado"}, status=401)
                
                


@csrf_exempt
def stripe_webhook(request):
    payload = request.body.decode('utf-8')
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = STRIPE_SIGNATURE

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        # Payload inválido
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        # Assinatura inválida
        return HttpResponse(status=400)

    # Processar o evento
    
    # --- CHECKOUT FINALIZADO ---
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        uid = session.get('client_reference_id')
        email = session.get('customer_details', {}).get('email')
        stripe_customer_id = session.get('customer')
        fbp = session.metadata.get('fbp')
        fbclid = session.metadata.get('fbclid')
        language = session.metadata.get('language')

        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
        user_agent = request.META.get('HTTP_USER_AGENT')

        userProfileService = UserProfileService(uid=uid, email=email, stripe_customer_id=stripe_customer_id)
        user = userProfileService.get_user_profile_by_uid()

        if user:
            userProfileService.update_user_stripe_customer_id()
            send_purchase_event(
                user_agent=user_agent,
                ip=ip,
                fbp=fbp,
                fbclid=fbclid,
                plan_name=user.plan.name,
                language=user.language,
                )
            if not user.email_encrypted:
                user.update_user_email()
            if not user.language:
                userProfileService.update_user_language(language)
            return JsonResponse({'message': 'Stripe customer ID associado com sucesso'})
        else:
            payment_intent = session.get('payment_intent')
            if payment_intent:
                try:
                    stripe.Refund.create(payment_intent=payment_intent)
                except Exception as e:
                    logger.error(f'Erro ao reembolsar pagamento: {e}')
            return JsonResponse({'error': 'Usuário não encontrado. Pagamento reembolsado.'}, status=400)

    # --- NOVA ASSINATURA CRIADA ---
    elif event['type'] == 'customer.subscription.created':
        logger.info("STRIPE EVENTO  customer.subscription.created")
        subscription = event['data']['object']
        stripe_customer_id = subscription['customer']
        email_hash = subscription['metadata'].get('email_hash')
        price_id = subscription['items']['data'][0]['price']['id']
        subscription_id = subscription['id']

        
        #cirar get plan
        
        logger.info("STRIPE EVENTO  subscription.created:   PLAN:   ", plan)
        userProfileService = UserProfileService(stripe_customer_id=stripe_customer_id)
        user = userProfileService.get_user_by_stripe_id()
        
        logger.info("STRIPE EVENTO  subscription.created:   USER:   ", user)
        if not user:
            user = UserProfileService.get_user_by_email_hash(email_hash=email_hash)
            logger.info("STRIPE EVENTO  subscription.created:   USER:   ", user)
        if user:
            #verificar update plan
            plan = PlanService.get_plan_by_price_id(price_id, user=user)
            userProfileService.update_user_plan(plan=plan, stripe_subscription_id=subscription_id, user=user)
            logger.info("STRIPE EVENTO  subscription.created:   PLANO ATUALIZADO")
            return JsonResponse({'message': 'Assinatura criada com sucesso'})
        else:
            stripe.Subscription.delete(subscription['id'])
            logger.info("STRIPE EVENTO  subscription.created:   CANCELANDO ASSINATURA")
            return JsonResponse({'error': 'Usuário não encontrado. Assinatura cancelada.'}, status=400)

    # --- UPGRADE / DOWNGRADE ---
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        stripe_customer_id = subscription['customer']
        price_id = subscription['items']['data'][0]['price']['id']
        subscription_id = subscription['id']

        
        userProfileService = UserProfileService(stripe_customer_id=stripe_customer_id)
        user = userProfileService.get_user_by_stripe_id()

        if user:
            plan = PlanService.get_plan_by_price_id(price_id=price_id, user=user)
            userProfileService.update_user_plan(plan=plan, stripe_subscription_id=subscription_id, user=user)
            return JsonResponse({'message': 'Assinatura atualizada'})
        else:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=200)

    # --- CANCELAMENTO ---
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        stripe_customer_id = subscription['customer']
        subscription_id = None

        plan = PlanService.get_plan_by_name('Free')
        userProfileService = UserProfileService(plan=plan, stripe_customer_id=stripe_customer_id)
        user = userProfileService.get_user_by_stripe_id()

        if user:
            userProfileService.update_user_plan(subscription_id, user)
            return JsonResponse({'message': 'Plano revertido para gratuito'})
        else:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=200)

    # --- RENOVAÇÃO AUTOMÁTICA (invoice.paid) ---
    elif event['type'] == 'invoice.paid':
        invoice = event['data']['object']
        stripe_customer_id = invoice.get('customer')
        price_id = invoice.get('lines', {}).get('data', [{}])[0].get('price', {}).get('id')
        subscription_id = invoice.get('subscription')
        
        
        userProfileService = UserProfileService(stripe_customer_id=stripe_customer_id)
        user = userProfileService.get_user_by_stripe_id()

        if user:
            plan = PlanService.get_plan_by_price_id(price_id, user=user)
            if user.plan == plan:
                UserProfileService.update_user_limit(user, plan=plan)
            else:
                userProfileService.update_user_plan(plan=plan, stripe_subscription_id=subscription_id, user=user)
            return JsonResponse({'message': 'Plano renovado com sucesso'})
        else:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=200)

    # --- FALHA DE PAGAMENTO ---
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        stripe_customer_id = invoice.get('customer')
        subscription_id = None

        plan = PlanService.get_plan_by_name('Free')
        userProfileService = UserProfileService(plan=plan, stripe_customer_id=stripe_customer_id)
        user = userProfileService.get_user_by_stripe_id()

        if user:
            userProfileService.update_user_plan(subscription_id, user)
            return JsonResponse({'message': 'Plano rebaixado por falha de pagamento'})
        else:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=200)

    return HttpResponse(status=200)


@csrf_exempt
def telegram_webhook(request):
    if request.method == 'POST':
        telegram_service = TelegramService()
        processor = MessageProcessor()
        data = json.loads(request.body)
        
        # Verifica se é um callback query (clique no botão)
        if "callback_query" in data:
            logger.info("telegram_webhook: Callback query recebido")
            query = data["callback_query"]
            callback_data = query["data"]
            chat_id = str(query["message"]["chat"]["id"])
            message_id = query["message"]["message_id"]
            callback_id = query["id"]
            user_id = query["from"]["id"]

            if callback_data.startswith("language:"):
                logger.info(f"telegram_webhook: Callback de idioma recebido: {callback_data}")
                idioma = callback_data.split(":")[1]
                if idioma not in ['pt', 'en', 'es']:
                    logger.error(f"telegram_webhook: Idioma inválido recebido: {idioma}")
                    return JsonResponse({'error': 'Idioma inválido.'}, status=400)
                # Salvar idioma no banco
                try:
                    logger.info(f"telegram_webhook: Salvando idioma {idioma} para o chat_id: {chat_id}")
                    userProfileService = UserProfileService(telegram_chat_id=chat_id)
                    user_exists = userProfileService.get_user_profile_by_telegram_chat_id()
                    if not user_exists:
                        logger.error(f"Usuário não encontrado para o chat_id: {chat_id}")
                        return JsonResponse({'error': 'Usuário não encontrado.'}, status=404)
                    logger.info(f"telegram_webhook: Atualizando idioma do usuário {user_exists.firebase_uid} para {idioma}")
                    userProfileService.update_user_language(idioma)
                except Exception as e:
                    logger.error(f"Erro ao salvar idioma do usuário: {e}")

                mensagem = {
                    "pt": "✅ Idioma definido para Português!",
                    "en": "✅ Language set to English!",
                    "es": "✅ Idioma configurado a Español!"
                }.get(idioma, "✅ Idioma atualizado.")

                # Remover o loading do botão
                logger.info(f"telegram_webhook: Respondendo ao callback query {callback_id}")
                telegram_service.answer_callback_query(callback_id)

                # Editar a mensagem original com a confirmação
                logger.info(f"telegram_webhook: Editando mensagem {message_id} no chat {chat_id} com a mensagem: {mensagem}")
                telegram_service.edit_message_text(chat_id, message_id, mensagem)

            return JsonResponse({"ok": True})
        
        # Processa mensagem normal
        message = data.get('message', {})
        chat_id = str(message.get('chat', {}).get('id'))
        text = message.get('text', '')
        userProfileService = UserProfileService(telegram_chat_id=chat_id)
        user_exists = userProfileService.get_user_profile_by_telegram_chat_id()
        
        if text.startswith('/start'):
            try:
                if not user_exists:
                    userProfileService.create_user_telegram()
                
                # Envia seleção de idioma
                telegram_service.strategy_send_select_language(chat_id)
                
                return JsonResponse({'message': 'Seleção de idioma enviada.'}, status=200)
            except Exception as e:
                logger.error(f"Erro ao criar/validar usuario")
                return JsonResponse({'message': 'Erro ao criar o usuario anonimo.'}, status=200)
        
        if text.startswith('/language'):
            # Envia seleção de idioma
            telegram_service.strategy_send_select_language(chat_id)
            return JsonResponse({'message': 'Seleção de idioma enviada.'}, status=200)

        if user_exists:
            if not user_exists.language:
                telegram_service.strategy_send_select_language(chat_id)
                return JsonResponse({'message': 'Seleção de idioma enviada.'}, status=200)
            authed = userProfileService.verify_user_searchs_limit()
            if authed:
                telegram_service.strategy_send_init_process(chat_id=chat_id, language=user_exists.language)
                processor.process_inbound_message(
                    telegram_chat_id=chat_id,
                    message_body=text,
                    user_profile=user_exists
                )
                return JsonResponse({'message': 'Menssagem enviada.'}, status=200)
            else:
                telegram_service.strategy_send_message_limit(chat_id=chat_id, language=user_exists.language)
                return JsonResponse({'error': 'Limite de pesquisas excedido.'}, status=200)
        else:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=200)

    else:
        return JsonResponse({'error': 'Método não permitido.'}, status=405)
    
@csrf_exempt
def whatsapp_webhook(request):
    logger.info(f'whatsapp_webhook: Método {request.method} recebido')
    if request.method == 'GET':
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')

        if mode == 'subscribe' and token == WHATSAPP_VERIFY_TOKEN:
            return HttpResponse(challenge, status=200)
        else:
            return HttpResponseBadRequest("Token inválido.")

    whatsapp_service = WhatsappService()
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            entry = data.get('entry', [])
            if not entry:
                logger.warning("whatsapp_webhook: Nenhuma entrada encontrada no payload.")
                return HttpResponse(status=200)
            changes = entry[0].get('changes', [])

            if not changes:
                logger.warning("whatsapp_webhook: Nenhuma mudança encontrada no payload.")
                return HttpResponse(status=200)
            
            value = changes[0].get('value', {})
            messages = value.get('messages', [])
            if not messages:
                logger.warning("whatsapp_webhook: Nenhuma mensagem encontrada no payload.")
                return HttpResponse(status=200)

            message = messages[0]
            from_number = message.get('from')
            from_number = format_phone_number(from_number)

            message_body = None
            if message.get('type') == 'text':
                message_body = message['text']['body']
                logger.info(f"whatsapp_webhook: Mensagem de texto recebida: {message_body}")

            elif message.get('type') == 'interactive':
                interactive = message.get('interactive')
                logger.info(f"whatsapp_webhook: Mensagem interativa recebida: {interactive}")

                if interactive['type'] == 'button_reply':
                    message_body = interactive['button_reply']['id']
                    logger.info(f"whatsapp_webhook: ID do botão interativo recebido: {message_body}")

            if from_number and message_body:
                logger.info(f"whatsapp_webhook: Número de telefone do remetente: {from_number}")
                from_number_hash = hash_phone_number(from_number)
                userProfileService = UserProfileService(phone_hash=from_number_hash)
                user_exists = userProfileService.get_user_profile_by_phone_hash()

                if user_exists:
                    logger.info(f"whatsapp_webhook: Usuário encontrado: {user_exists.firebase_uid}")
                    if message_body in ['lang_ptbr', 'lang_en']:
                        if message_body == 'lang_ptbr':
                            logger.info(f"whatsapp_webhook: Idioma selecionado: Português")
                            message_body = 'pt'
                        elif message_body == 'lang_en':
                            logger.info(f"whatsapp_webhook: Idioma selecionado: Inglês")
                            message_body = 'en'
                        logger.info(f"Idioma selecionado: {message_body} para o número {from_number}")
                        try:
                            userProfileService.update_user_language(language=message_body)
                            whatsapp_service.send_selected_language_message(from_number, message_body)
                            logger.info(f"Idioma do usuário {user_exists.firebase_uid} atualizado para {message_body}")
                        except Exception as e:
                            logger.error(f"Erro ao atualizar idioma do usuário: {e}")
                        return HttpResponse(status=200)
                    
                    if user_exists.language is None:
                        logger.info(f"whatsapp_webhook: Idioma não definido para o usuário {user_exists.firebase_uid}. Enviando botões de seleção de idioma.")
                        whatsapp_service.send_language_buttons(from_number)
                        return HttpResponse(status=200)
                    
                    authed = userProfileService.verify_user_searchs_limit()
                    if authed:
                        logger.info(f"whatsapp_webhook: Usuário {user_exists.firebase_uid} autorizado a enviar mensagem.")
                        processor = MessageProcessor()
                        whatsapp_service.send_calmess_message(to_number=from_number, language=user_exists.language)
                        processor.process_inbound_message(
                            from_number=from_number,
                            message_body=message_body,
                            user_profile=user_exists,
                        )
                        return HttpResponse(status=200)
                    else:

                        whatsapp_service.send_limit_reached_message(from_number, user_exists.language)
                        logger.info(f'Limite de pesquisas excedido para o usuário {user_exists.firebase_uid}')
                        return HttpResponse(status=200)
                else:
                    logger.info(f"whatsapp_webhook: Usuário não encontrado. Criando usuário anônimo.")
                    user_profile = userProfileService.create_user_anonymous()
                    if isinstance(user_profile, UserProfile):
                        logger.info(f"whatsapp_webhook: Usuário anônimo criado com sucesso: {user_profile.firebase_uid}")
                        whatsapp_service.send_language_buttons(from_number)
                        logger.info(f"whatsapp_webhook: Botões de seleção de idioma enviados para o número {from_number}")
                        return HttpResponse(status=200)
                    else:
                        logger.error(f'Erro ao criar usuário.')
                        return HttpResponse(status=200)
            else:
                logger.warning("Número ou conteúdo da mensagem ausente.")
                return HttpResponse(status=200)

        except Exception as e:
            logger.error(f'Erro na view whatsapp_webhook: {e}')
            return HttpResponse(status=200)
    
    logger.error(f'whatsapp_webhook: Método não permitido: {request.method}')
    return HttpResponse(status=405)



# @csrf_exempt
# def twilio_webhook(request):
#     # O Twilio envia dados via POST
#     if request.method == 'POST':
#         try:
#             from_number = request.POST.get('WaId')
#             message_body = request.POST.get('Body')

#             if from_number and message_body:
#                 from_number_hash = hash_phone_number(from_number)
#                 userProfileService = UserProfileService(phone_hash=from_number_hash)
#                 user_exists = userProfileService.get_user_profile_by_phone_hash()
#                 if user_exists:
#                     authed = user_exists.verify_user_searchs_limit()
#                     if authed:
#                         processor = MessageProcessor()
#                         processor.process_inbound_message(
#                             from_number=from_number,
#                             message_body=message_body,
#                             user_profile=user_exists
#                         )
#                         return HttpResponse('', status=200)
#                     else:
#                         # TODO: Enviar mensagem de limite de buscas atingido
#                         return HttpResponse('', status=200)
#                 else:
#                     user_profile = userProfileService.create_user_anonymous()
#                     if type(user_profile) == UserProfile:
#                         processor = MessageProcessor()
#                         processor.process_inbound_message(
#                             from_number=from_number,
#                             message_body=message_body
#                         )
#                         return HttpResponse('', status=200)
#                     else:
#                         # TODO: Enviar mensagem de erro ao criar usuário
#                         logger.error(f'Erro ao criar usuário.')
#                         return HttpResponse('', status=200)
#             else:
#                 logger.error(f'Não recebeu número ou mensagem.')
#                 # TODO: Enviar mensagem de erro ao não receber número ou mensagem
#                 return HttpResponse('', status=200)
#         except Exception as e:
#             logger.error(f'Erro na view twilio_webhook: {e}')
#             # Em caso de erro, ainda retornamos 200 para evitar que o Twilio reenvie a mensagem,
#             return HttpResponse('', status=200)

#     else:
#         return HttpResponse('', status=405)



# @csrf_exempt
# def user_update_phone_number(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             firebase_token = data.get('firebaseToken')
#             phone_number = data.get('phoneNumber')
#             phone_number_hash = hash_phone_number(phone_number)

#             firebaseService = FirebaseService(firebase_token)
#             uid, email = firebaseService.verify_firebase_token()

#             if uid and email:
#                 userProfileService = UserProfileService(uid=uid, email=email, phone_hash=phone_number_hash)
#                 user_exists = userProfileService.get_user_profile_by_uid()

#                 if user_exists:
#                     verify = userProfileService.update_user_phone_number(phone_number_hash)
#                     if type(verify) == UserProfile:
#                         return JsonResponse({
#                             'message': 'Número de telefone atualizado com sucesso.'}, 
#                             status=200)
#                     else:
#                         return JsonResponse({
#                             'error': 'Erro ao atualizar número de telefone.', 
#                             'message': 'codigo de verificação inválido'}, 
#                             status=500)
#                 else:
#                     return JsonResponse({
#                         'error': 'Usuário não encontrado.'}, status=404)
#             else:
#                 logger.error(f'Token do Firebase inválido ou expirado.')
#                 return JsonResponse({'error': 'Token do Firebase inválido ou expirado.'}, status=401)
#         except Exception as e:
#             logger.error(f'Erro na view user_upadete_phone_number: {e}')
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Método não permitido.'}, status=405)

# @csrf_exempt
# def verify_user_phone_number(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             firebase_token = data.get('firebaseToken')
#             phone_number = data.get('phoneNumber')
#             phone_number_hash = hash_phone_number(phone_number)
#             firebaseService = FirebaseService(firebase_token)
#             uid, email = firebaseService.verify_firebase_token()
#             if uid and email:
#                 userProfileService = UserProfileService(uid=uid, email=email, phone_hash=phone_number_hash)
#                 user_exists = userProfileService.get_user_profile_by_uid()
#                 if user_exists:
#                     code = generate_code_assert()
#                     userProfileService.save_code_assert(code)
#                     processor = MessageProcessor()
#                     processor.process_send_code_assert(phone_number, code)
#                     return JsonResponse({'message': 'Código de verificação enviado com sucesso.'}, status=200)
#                 else:
#                     logger.error(f'Usuário não encontrado.')
#                     return JsonResponse({'error': 'Usuário não encontrado.'}, status=404)
#             else:
#                 logger.error(f'Token do Firebase inválido ou expirado.')
#                 return JsonResponse({'error': 'Token do Firebase inválido ou expirado.'}, status=401)
#         except Exception as e:
#             logger.error(f'Erro na view verify_user_phone_number: {e}')
#             return JsonResponse({'error': str(e)}, status=500)