<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlankController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\PatientController;
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
});


Route::post('/login', [AuthController::class, 'login']);
