<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patients = Patient::paginate(10);

        return response()->json($patients);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'last_name' => 'required',
            'first_name' => 'required',
            'rd' => 'required|unique:patient',
            'dob' => 'required',
            'gender' => 'required',
            'age' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $patient = Patient::create($request->all());
        if ($patient) {
            return response()->json(['message' => 'Үйлчлүүлэгч нэмэгдлээ', 'patient' => $patient]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'patient' => null], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($rd)
    {
        $patient = Patient::whereRaw('LOWER(rd) = ?', strtolower($rd))->first();
        if ($patient) {
            return response()->json(['message' => 'Амжилттай', 'patient' => $patient], 200);
        } else {
            return response()->json(['message' => "$rd Үйлчлүүлэгч олдсонгүй", 'patient' => null], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if ($patient) {
            $patient->fill($request->all());
            $patient->save();
            return response()->json(['message' => 'Үйлчлүүлэгч хадгалагдлаа', 'patient' => $patient], 200);
        } else {
            return response()->json(['message' => 'Үйлчлүүлэгч байхгүй байна'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if ($patient) {
            $patient->delete();
            return response()->json(['message' => 'Үйлчлүүлэгч устгагдлаа'], 200);
        } else {
            return response()->json(['message' => 'Үйлчлүүлэгч байхгүй байна'], 404);
        }
    }
}
