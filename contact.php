<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Aervanta Contact Form Backend
|--------------------------------------------------------------------------
| This form only sends emails on a server that supports PHP mail().
| For local testing, run:
|
| php -S localhost:8000
|
| Then open:
| http://localhost:8000/contact.html
|--------------------------------------------------------------------------
*/

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Please check the required fields and try again.', 405);
}

$recipientEmail = 'hello@aervanta.com';
$recipientName = 'Aervanta Request Desk';

$requiredFields = [
    'fullName',
    'email',
    'phone',
    'service',
    'message',
    'sourcePage',
    'privacyConsent'
];

function respond(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);

    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);

    exit;
}

function field(string $key): string
{
    return trim((string)($_POST[$key] ?? ''));
}

function clean(string $value, int $maxLength = 1000): string
{
    $value = trim($value);
    $value = strip_tags($value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '';
    $value = mb_substr($value, 0, $maxLength, 'UTF-8');

    return $value;
}

function hasHeaderInjection(string $value): bool
{
    return (bool)preg_match('/[\r\n]/', $value);
}

function normalizePhone(string $value): string
{
    return preg_replace('/[^\d+\-\s().]/', '', $value) ?? '';
}

function buildEmailBody(array $data): string
{
    return implode("\n", [
        'New Aervanta HVAC request',
        '==========================',
        '',
        'Full name: ' . $data['fullName'],
        'Email: ' . $data['email'],
        'Phone: ' . $data['phone'],
        'Service category: ' . $data['service'],
        'Source page: ' . $data['sourcePage'],
        '',
        'Request details:',
        $data['message'],
        '',
        'Aggregator notice:',
        'Submitting this form does not create a service agreement. Aervanta is an independent HVAC provider-matching platform and does not perform HVAC work directly.',
        '',
        'Timestamp: ' . gmdate('Y-m-d H:i:s') . ' UTC',
        'IP reference: ' . ($_SERVER['REMOTE_ADDR'] ?? 'Unavailable')
    ]);
}

/*
|--------------------------------------------------------------------------
| Honeypot anti-spam protection
|--------------------------------------------------------------------------
| The visible form leaves the "website" field empty.
| Bots often fill it.
|--------------------------------------------------------------------------
*/

$honeypot = field('website');

if ($honeypot !== '') {
    respond(true, 'Thank you. Your request has been received.');
}

/*
|--------------------------------------------------------------------------
| Minimum submission timing protection
|--------------------------------------------------------------------------
| The frontend sets formStartedAt to Date.now().
| Very fast submissions are likely automated.
|--------------------------------------------------------------------------
*/

$formStartedAt = field('formStartedAt');

if ($formStartedAt !== '' && ctype_digit($formStartedAt)) {
    $elapsedSeconds = (time() * 1000 - (int)$formStartedAt) / 1000;

    if ($elapsedSeconds < 2) {
        respond(false, 'Please check the required fields and try again.', 400);
    }
}

/*
|--------------------------------------------------------------------------
| Required field validation
|--------------------------------------------------------------------------
*/

foreach ($requiredFields as $fieldName) {
    if (field($fieldName) === '') {
        respond(false, 'Please check the required fields and try again.', 400);
    }
}

$fullName = clean(field('fullName'), 120);
$email = clean(field('email'), 180);
$phone = clean(normalizePhone(field('phone')), 60);
$service = clean(field('service'), 160);
$message = clean(field('message'), 2500);
$sourcePage = clean(field('sourcePage'), 180);
$privacyConsent = clean(field('privacyConsent'), 10);

if (mb_strlen($fullName, 'UTF-8') < 2) {
    respond(false, 'Please check the required fields and try again.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || hasHeaderInjection($email)) {
    respond(false, 'Please check the required fields and try again.', 400);
}

if (mb_strlen($phone, 'UTF-8') < 6) {
    respond(false, 'Please check the required fields and try again.', 400);
}

if (mb_strlen($service, 'UTF-8') < 2) {
    respond(false, 'Please check the required fields and try again.', 400);
}

if (mb_strlen($message, 'UTF-8') < 10) {
    respond(false, 'Please check the required fields and try again.', 400);
}

if ($privacyConsent !== 'yes') {
    respond(false, 'Please check the required fields and try again.', 400);
}

if (
    hasHeaderInjection($fullName) ||
    hasHeaderInjection($phone) ||
    hasHeaderInjection($service) ||
    hasHeaderInjection($sourcePage)
) {
    respond(false, 'Please check the required fields and try again.', 400);
}

/*
|--------------------------------------------------------------------------
| Allowed service categories
|--------------------------------------------------------------------------
*/

$allowedServices = [
    'HVAC Installation & Replacement',
    'Air Conditioning Services',
    'Heating & Furnace Services',
    'Heat Pump Services',
    'HVAC Maintenance & Tune-Ups',
    'Indoor Air Quality & Ventilation',
    'Not sure yet'
];

if (!in_array($service, $allowedServices, true)) {
    respond(false, 'Please check the required fields and try again.', 400);
}

$data = [
    'fullName' => $fullName,
    'email' => $email,
    'phone' => $phone,
    'service' => $service,
    'message' => $message,
    'sourcePage' => $sourcePage
];

$subject = 'New Aervanta HVAC Request - ' . $service;
$body = buildEmailBody($data);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Aervanta Request Desk <no-reply@aervanta.com>',
    'Reply-To: ' . $fullName . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

$mailSent = @mail(
    $recipientName . ' <' . $recipientEmail . '>',
    $subject,
    $body,
    implode("\r\n", $headers)
);

if (!$mailSent) {
    respond(false, 'Please check the required fields and try again.', 500);
}

respond(true, 'Thank you. Your request has been received.');
