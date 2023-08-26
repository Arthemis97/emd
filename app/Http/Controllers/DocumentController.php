<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $data = $request->all();
        $validator = Validator::make($data, [
            'template_id' => 'required',
            'patient_id' => 'required',
            'data' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $document = new Document();
        $document->patient_id = $data['patient_id'];
        $document->template_id = $data['template_id'];
        $document->data = json_encode($data['data']);
        $document->save();
        if ($document) {
            $withtemplate = $document;
            $withtemplate->template = $document->template;
            return response()->json(['message' => 'Маягт нэмэгдлээ', 'document' => $document]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'document' => null], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $document = Document::findOrFail($id);
        return response()->json(['message' => 'Маягт', 'document' => $document]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'data' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $document = Document::findOrFail($id);
        $document->data = json_encode($data['data']);
        $document->save();
        if ($document) {
            $withtemplate = $document;
            $withtemplate->template = $document->template;
            return response()->json(['message' => 'Маягт хадгалагдлаа', 'document' => $document]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'document' => null], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $document = Document::find($id);

        if ($document) {
            $document->delete();
            return response()->json(['message' => 'Маягт устгагдлаа'], 200);
        } else {
            return response()->json(['message' => 'Маягт байхгүй байна'], 404);
        }
    }

    public function getByPatient($id)
    {
        $documents = Document::where('patient_id', $id)
            ->with('template:id,name')
            ->whereHas('template', function ($query) {
                $query->whereNotNull('id');
            })
            ->orderBy('created_at', 'desc')->get();
        return response()->json(['message' => 'Амжилттай', 'document' => $documents], 200);
    }

    public function getIds(Request $request)
    {
        $data = $request->all();
        $documents = [];
        foreach ($data['ids'] as $key => $value) {
            $document = Document::findOrFail($value);
            $document->template = Template::findOrFail($document->template_id);
            array_push($documents, $document);
        }
        return response()->json(['message' => 'Амжилттай', 'document' => $documents], 200);
    }

    public function localGeneratePdf(Request $request)
    {
        $files = $request->file('files');
        $formData = $request->only('html', 'temp');
        $req = Http::withHeaders([
            'Accept' => 'multipart/form-data',
        ]);
        foreach ($formData as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $item) {
                    $req = $req->attach($key . '[]', $item);
                }
            } else {
                $req = $req->attach($key, $value);
            }
        }
        if ($files) {
            foreach ($files as $value) {
                $req = $req->attach(
                    'files',
                    file_get_contents($value->path()),
                    $value->getClientOriginalName()
                );
            }
        }

        $response = $req->post(env('VITE_PDF_URL') . "/generate");

        return $response->body();
    }

    public function localOrderPdf(Request $request)
    {
        $response = Http::asForm()->post(env('VITE_PDF_URL') . '/order', $request->all());
        return $response->body();
    }
}
