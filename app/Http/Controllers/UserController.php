<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::paginate(1000)->toArray();
        return response()->json($users);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'phone' => 'required|unique:users',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'type' => $request->type,
        ]);

        return response()->json([
            'message' => 'Бүртгэл амжилттай',
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if ($user) {
            $user->fill($request->all());
            if ($request->has('password')) {
                $password = $request->input('password');
                $hashedPassword = Hash::make($password);
                $user->password = $hashedPassword;
            }
            $user->save();
            return response()->json(['message' => 'Ажилтан хадгалагдлаа', 'user' => $user], 200);
        } else {
            return response()->json(['message' => 'Ажилтан байхгүй байна'], 404);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();
            return response()->json(['message' => 'Ажилтан устгагдлаа'], 200);
        } else {
            return response()->json(['message' => 'Ажилтан байхгүй байна'], 404);
        }
    }
}
