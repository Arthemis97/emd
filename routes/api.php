<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlankController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json('Logged out');
    });


    // USER CONTROLLER
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'register']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // PATIENT CONTROLLER
    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{rd}', [PatientController::class, 'show']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

    // PATIENT IMAGE
    Route::get('/images/{id}', [ImageController::class, 'index']);
    Route::post('/images/{id}', [ImageController::class, 'store']);
    Route::delete('/images/{id}', [ImageController::class, 'destroy']);

    // BLANK CONTROLLER
    Route::get('/blanks', [BlankController::class, 'index']);
    Route::post('/blanks', [BlankController::class, 'store']);
    Route::put('/blanks/{id}', [BlankController::class, 'update']);
    Route::delete('/blanks/{id}', [BlankController::class, 'destroy']);

    // PACKAGE CONTROLLER
    Route::get('/packages', [PackageController::class, 'index']);
    Route::post('/packages', [PackageController::class, 'store']);
    Route::put('/packages/{id}', [PackageController::class, 'update']);
    Route::delete('/packages/{id}', [PackageController::class, 'destroy']);

    // TEMPLATE CONTROLLER
    Route::get('/templates', [TemplateController::class, 'index']);
    Route::get('/templates/{id}', [TemplateController::class, 'show']);
    Route::post('/templates', [TemplateController::class, 'store']);
    Route::put('/templates/{id}', [TemplateController::class, 'update']);
    Route::delete('/templates/{id}', [TemplateController::class, 'destroy']);

    // DOCUMENT CONTROLLER
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::put('/documents/{id}', [DocumentController::class, 'update']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    Route::get('/documents/patient/{id}', [DocumentController::class, 'getByPatient']);
    Route::post('/documents/pdf', [DocumentController::class, 'getPDF']);
    Route::post('/documents/ids', [DocumentController::class, 'getIds']);
});


Route::post('/login', [AuthController::class, 'login']);
